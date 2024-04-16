// pencil_holder.ts
// a printable grid for putting your pencils

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
	//contour,
	//contourCircle,
	ctrRectangle,
	figure,
	//degToRad,
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
	partName: 'pencil_holder',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('Nx', 'holes', 7, 1, 20, 1),
		pNumber('Ny', 'holes', 5, 1, 20, 1),
		pNumber('Lx', 'mm', 10, 1, 40, 1),
		pNumber('Ly', 'mm', 10, 1, 40, 1),
		pSectionSeparator('Spacing and rounded'),
		pNumber('E1', 'mm', 2, 1, 50, 1),
		pNumber('E2', 'mm', 10, 1, 50, 1),
		pNumber('R1', 'mm', 2, 0, 10, 1),
		pNumber('R2', 'mm', 5, 0, 10, 1),
		pSectionSeparator('Height'),
		pNumber('H1', 'mm', 50, 1, 200, 1)
	],
	paramSvg: {
		Nx: 'pencil_holder_top.svg',
		Ny: 'pencil_holder_top.svg',
		Lx: 'pencil_holder_top.svg',
		Ly: 'pencil_holder_top.svg',
		E1: 'pencil_holder_top.svg',
		E2: 'pencil_holder_top.svg',
		R1: 'pencil_holder_top.svg',
		R2: 'pencil_holder_top.svg',
		H1: 'pencil_holder_top.svg'
	},
	sim: {
		tMax: 100,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

// step-3 : definition of the function that creates from the parameter-values the figures and construct the 3D
function pGeom(t: number, param: tParamVal, suffix = ''): tGeom {
	const rGeome = initGeom(pDef.partName + suffix);
	const figTop = figure();
	const figFace = figure();
	const figSide = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const LtotX = 2 * param.E2 + param.Nx * (param.Lx + param.E1) - param.E1;
		const LtotY = 2 * param.E2 + param.Ny * (param.Ly + param.E1) - param.E1;
		// step-5 : checks on the parameter values
		if (2 * param.R1 > Math.min(param.Lx, param.Ly)) {
			throw `err123: R1 ${param.R1} is too large compare to Lx ${param.Lx} or Ly ${param.Ly}`;
		}
		// step-6 : any logs
		rGeome.logstr += `pencil_holder size ${ffix(LtotX)} x ${ffix(LtotY)} mm\n`;
		// step-7 : drawing of the figures
		// figTop
		figTop.addMain(ctrRectangle(0, 0, LtotX, LtotY, param.R2));
		for (let i = 0; i < param.Nx; i++) {
			for (let j = 0; j < param.Ny; j++) {
				figTop.addMain(
					ctrRectangle(
						param.E2 + i * (param.Lx + param.E1),
						param.E2 + j * (param.Ly + param.E1),
						param.Lx,
						param.Ly,
						param.R1
					)
				);
			}
		}
		// figFace
		figFace.addMain(ctrRectangle(0, 0, LtotX, param.H1));
		for (let i = 0; i < param.Nx; i++) {
			figFace.addSecond(
				ctrRectangle(param.E2 + i * (param.Lx + param.E1), 0, param.Lx, param.H1)
			);
		}
		// figSide
		figSide.addMain(ctrRectangle(0, 0, LtotY, param.H1));
		for (let i = 0; i < param.Ny; i++) {
			figSide.addSecond(
				ctrRectangle(param.E2 + i * (param.Ly + param.E1), 0, param.Ly, param.H1)
			);
		}
		// final figure list
		rGeome.fig = {
			faceTop: figTop,
			faceFace: figFace,
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
		rGeome.logstr += 'pencil_holder drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const pencilHolderDef: tPageDef = {
	pTitle: 'Pencil-Holder',
	pDescription: 'A fancy printable pencil-holder',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { pencilHolderDef };
