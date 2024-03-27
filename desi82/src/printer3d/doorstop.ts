// doorstop.ts
// a parametrizable doorstop

// step-1 : import from geometrix
import type {
	//tContour,
	tParamDef,
	tParamVal,
	tGeom,
	//tExtrude,
	tPageDef
	//tSubInst
	//tSubDesign
} from 'geometrix';
import {
	//point,
	contour,
	contourCircle,
	ctrRectangle,
	figure,
	//degToRad,
	radToDeg,
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
	partName: 'doorstop',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('H1', 'mm', 40, 5, 200, 1),
		pNumber('L1', 'mm', 100, 10, 300, 1),
		pNumber('W1', 'mm', 30, 5, 200, 1),
		pSectionSeparator('Details'),
		pNumber('R1', 'mm', 2, 1, 30, 1),
		pNumber('E1', 'mm', 4, 1, 20, 1)
	],
	paramSvg: {
		H1: 'doorstop_profile.svg',
		L1: 'doorstop_profile.svg',
		R1: 'doorstop_profile.svg',
		E1: 'doorstop_profile.svg',
		W1: 'doorstop_profile.svg'
	},
	sim: {
		tMax: 100,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

// internal constrains
const minRadius = 2;

// step-3 : definition of the function that creates from the parameter-values the figures and construct the 3D
function pGeom(t: number, param: tParamVal, suffix = ''): tGeom {
	const rGeome = initGeom(pDef.partName + suffix);
	const figProfile = figure();
	const figTop = figure();
	const figSide = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const Ltot = param.L1 + param.H1;
		const a1 = Math.atan2(param.H1, param.L1);
		const a2 = a1 / 2;
		// step-5 : checks on the parameter values
		if (param.E1 > param.H1 / 2 - minRadius) {
			throw `err291: E1 ${param.E1} is too large compare to H1 ${param.H1}`;
		}
		// step-6 : any logs
		rGeome.logstr += `doorstop length ${ffix(Ltot)} mm, angle ${ffix(radToDeg(a1))} degree\n`;
		// step-7 : drawing of the figures
		// figProfile
		const ctrDoorstop = contour(0, 0)
			.addCornerRounded(param.R1)
			.addSegStrokeA(Ltot, 0)
			.addCornerRounded(param.R1)
			.addSegStrokeA(param.H1, param.H1)
			.addCornerRounded(param.R1)
			.addSegStrokeA(0, param.H1)
			.addCornerRounded(param.R1)
			.closeSegStroke();
		figProfile.addMain(ctrDoorstop);
		figProfile.addMain(contourCircle(param.H1 / 2, param.H1 / 2, param.H1 / 2 - param.E1));
		const listPosX: number[] = [];
		const listRadius: number[] = [];
		let x1 = param.L1;
		let y1 = Math.tan(a2) * x1;
		let radius = y1 - param.E1;
		while (radius > minRadius) {
			x1 = x1 - radius;
			y1 = Math.tan(a2) * x1;
			radius = y1 - param.E1;
			const tPosX = Ltot - x1;
			figProfile.addMain(contourCircle(tPosX, y1, radius));
			listPosX.push(tPosX);
			listRadius.push(radius);
			x1 = x1 - radius - param.E1;
			y1 = Math.tan(a2) * x1;
			radius = y1 - param.E1;
		}
		// figTop
		figTop.addMain(ctrRectangle(0, 0, param.H1, param.W1));
		figTop.addMain(ctrRectangle(param.H1, 0, param.L1, param.W1));
		figTop.addSecond(ctrRectangle(param.E1, 0, param.H1 - 2 * param.E1, param.W1));
		for (const [idx, px] of listPosX.entries()) {
			const tR = listRadius[idx];
			figTop.addSecond(ctrRectangle(px - tR, 0, 2 * tR, param.W1));
		}
		// figSide
		figSide.addMain(ctrRectangle(0, 0, param.W1, param.H1));
		figSide.addSecond(ctrRectangle(0, param.E1, param.W1, param.H1 - 2 * param.E1));
		// final figure list
		rGeome.fig = {
			faceProfile: figProfile,
			faceTop: figTop,
			faceSide: figSide
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}`,
					face: `${designName}_faceProfile`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.W1,
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
		rGeome.logstr += 'doorstop drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const doorstopDef: tPageDef = {
	pTitle: 'DoorStop',
	pDescription: 'A useful printable doorstop',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { doorstopDef };
