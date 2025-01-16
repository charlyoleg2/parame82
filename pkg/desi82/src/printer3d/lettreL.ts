// lettreL.ts
// drawing the letter L in capital

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
	contour,
	//contourCircle,
	figure,
	//degToRad,
	//radToDeg,
	ffix,
	pNumber,
	//pCheckbox,
	//pDropdown,
	initGeom,
	EExtrude,
	EBVolume
} from 'geometrix';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
const pDef: tParamDef = {
	partName: 'lettreL',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('C', 'mm', 10, 1, 200, 1),
		pNumber('E', 'mm', 30, 1, 200, 1),
		pNumber('B', 'mm', 50, 1, 200, 1),
		pNumber('AB', 'mm', 10, 1, 200, 1),
		pNumber('epaisseur', 'mm', 10, 1, 200, 1)
	],
	paramSvg: {
		C: 'lettreL.svg',
		E: 'lettreL.svg',
		B: 'lettreL.svg',
		AB: 'lettreL.svg',
		epaisseur: 'lettreL.svg'
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
	const fig1 = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		// step-5 : checks on the parameter values
		// step-6 : any logs
		rGeome.logstr += `lettreL area: ${ffix(param.C + param.E)} x ${ffix(param.B + param.AB)} mm\n`;
		// step-7 : drawing of the figures
		// fig1
		const ctrL = contour(0, 0)
			.addSegStrokeA(param.C + param.E, 0)
			.addSegStrokeA(param.C + param.E, param.AB)
			.addSegStrokeA(param.C, param.AB)
			.addSegStrokeA(param.C, param.B + param.AB)
			.addSegStrokeA(0, param.B + param.AB)
			.closeSegStroke();
		fig1.addMainO(ctrL);
		// final figure list
		rGeome.fig = {
			face1: fig1
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}`,
					face: `${designName}_face1`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: param.epaisseur,
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
		rGeome.logstr += 'lettreL drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const lettreLDef: tPageDef = {
	pTitle: 'Ma lettre L',
	pDescription: 'La lettre L ecrite en majuscule',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { lettreLDef };
