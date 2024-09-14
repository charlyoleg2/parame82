// spiral.ts
// a customable spiral

// step-1 : import from geometrix
import type {
	//tContour,
	//tOuterInner,
	tParamDef,
	tParamVal,
	tGeom,
	//tExtrude,
	tPageDef
	//tSubInst
	//tSubDesign
} from 'geometrix';
import {
	point,
	contour,
	//contourCircle,
	ctrRectangle,
	figure,
	degToRad,
	//radToDeg,
	ffix,
	pNumber,
	//pCheckbox,
	//pDropdown,
	pSectionSeparator,
	initGeom,
	EExtrude,
	EBVolume
} from 'geometrix';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
const pDef: tParamDef = {
	// partName is used in URL. Choose a name without slash, backslash and space.
	partName: 'spiral',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('QuadrantNb', 'quadrant', 9, 1, 100, 1),
		pNumber('W1', 'mm', 10, 1, 100, 1),
		pNumber('E1', 'mm', 30, 0, 100, 1),
		pNumber('E2', 'mm', 5, 0, 100, 1),
		pSectionSeparator('Height'),
		pNumber('H1', 'mm', 50, 1, 200, 1)
	],
	paramSvg: {
		QuadrantNb: 'spiral_top.svg',
		W1: 'spiral_top.svg',
		E1: 'spiral_top.svg',
		E2: 'spiral_top.svg',
		H1: 'spiral_top.svg'
	},
	sim: {
		tMax: 720,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

// step-3 : definition of the function that creates from the parameter-values the figures and construct the 3D
function pGeom(t: number, param: tParamVal, suffix = ''): tGeom {
	const rGeome = initGeom(pDef.partName + suffix);
	const figTop = figure();
	const figSide = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const Rend = param.W1 / 2;
		const Rstep = (param.W1 + param.E2) / 4;
		const pc = [point(0, 0), point(0, Rstep), point(-Rstep, Rstep), point(-Rstep, 0)];
		// step-5 : checks on the parameter values
		// step-6 : any logs
		rGeome.logstr += `spiral step ${ffix(Rstep)} mm\n`;
		// step-7 : drawing of the figures
		// figTop
		const posY: number[] = [];
		let Rs = param.E1 + param.W1;
		let As = Math.PI;
		let pi = point(0, 0).translatePolar(As, Rs);
		rGeome.logstr += `pi ${pi.cx} ${pi.cy}\n`;
		const ctrSpiral = contour(-param.E1, 0)
			.addPointA(pi.cx, pi.cy)
			.addSegArc(Rend, false, true);
		posY.push(pi.cx);
		for (let i = 0; i < param.QuadrantNb; i++) {
			As += Math.PI / 2;
			pi = pc[i % 4].translatePolar(As, Rs);
			ctrSpiral.addPointA(pi.cx, pi.cy).addSegArc(Rs, false, true);
			Rs += Rstep;
			if ((i - 1) % 4 === 0) {
				posY.push(pi.cx - param.W1);
			} else if ((i - 3) % 4 === 0) {
				posY.push(pi.cx);
			}
		}
		Rs -= Rstep + param.W1;
		const pu = pi.translatePolar(As + Math.PI, param.W1);
		ctrSpiral.addPointA(pu.cx, pu.cy).addSegArc(Rend, false, true);
		for (let i = 0; i < param.QuadrantNb; i++) {
			const j = param.QuadrantNb - 1 - i;
			As -= Math.PI / 2;
			pi = pc[j % 4].translatePolar(As, Rs);
			ctrSpiral.addPointA(pi.cx, pi.cy).addSegArc(Rs, false, false);
			Rs -= Rstep;
		}
		figTop.addMainO(ctrSpiral);
		// figSide
		for (const px of posY) {
			figSide.addMainO(ctrRectangle(px, 0, param.W1, param.H1));
		}
		// final figure list
		rGeome.fig = {
			faceTop: figTop.rotate(0, 0, degToRad(t)),
			faceSide: figSide
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}`,
					face: `${designName}_faceTop`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.H1,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				}
			],
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eIdentity,
					inList: [`subpax_${designName}`]
				}
			]
		};
		// step-9 : optional sub-design parameter export
		// sub-design
		rGeome.sub = {};
		// step-10 : final log message
		// finalize
		rGeome.logstr += 'spiral drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const spiralDef: tPageDef = {
	pTitle: 'Spiral',
	pDescription: 'A spiral to be forged',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { spiralDef };
