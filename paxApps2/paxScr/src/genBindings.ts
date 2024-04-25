#!/usr/bin/env node
// genBindings.ts

import type { tAllPageDef } from 'geometrix';
import { checkImpPages } from 'geometrix';
import yargs from 'yargs';
import fse from 'fs-extra';
import { hideBin } from 'yargs/helpers';
import packag from '../package.json';
import fs from 'fs';
import path from 'path';

interface tPackageJson {
	name: string;
	version: string;
}
interface tPaxAppConfig {
	colorBg: string;
	colorTitle: string;
	libs: string[];
}
interface tTopPackageJson extends tPackageJson {
	paxApps: tPaxAppConfig;
}
type tDependencies = Record<string, string>;
interface tDesiPackageJson extends tPackageJson {
	dependencies: tDependencies;
}

const k_paxApps = 'paxApps';
const k_dependencies = 'dependencies';
const k_name = 'name';
const k_version = 'version';

function read_file(fPath: string, fSuffix: string, eMsg = ''): string {
	let rStr = '';
	if (!fPath.endsWith(fSuffix)) {
		console.log(`err129: ${fPath} hasn't the expected file extension ${fSuffix}`);
		process.exit(1);
	}
	if (!fs.existsSync(fPath)) {
		console.log(`err134: file ${fPath} doesn't exist`);
		if (eMsg !== '') {
			console.log(eMsg);
		}
		process.exit(1);
	}
	try {
		rStr = fs.readFileSync(fPath, 'utf8');
	} catch (err) {
		console.log(`err156: error by parsing ${fPath}`);
		console.log(err);
		process.exit(1);
	}
	return rStr;
}

function write_file(fPath: string, fContent: string) {
	const dirPath = path.dirname(fPath);
	if (!fs.existsSync(dirPath)) {
		console.log(`err334: directory ${dirPath} doesn't exist`);
		process.exit(1);
	}
	try {
		fs.writeFileSync(fPath, fContent);
	} catch (err) {
		console.log(`err356: error by writing file ${fPath}`);
		console.log(err);
		process.exit(1);
	}
}

function getTopPackageJson(jsonPath: string): tPaxAppConfig {
	let rObj: tPaxAppConfig = {
		colorBg: 'DarkCyan',
		colorTitle: 'aquamarine',
		libs: []
	};
	const fContentStr = read_file(jsonPath, '.json');
	try {
		const packageJson = JSON.parse(fContentStr) as tTopPackageJson;
		if (k_paxApps in packageJson) {
			rObj = packageJson[k_paxApps];
		} else {
			console.log(`err142: JSON ${jsonPath} doesn't have the key '${k_paxApps}'`);
			process.exit(1);
		}
	} catch (err) {
		console.log(`err156: error by parsing ${jsonPath}`);
		console.log(err);
		process.exit(1);
	}
	return rObj;
}

function generate_scss(iCfg: tPaxAppConfig) {
	const fPath = '../desiXY-ui/src/lib/gen_colors.scss';
	const fStr = `// gen_colors.scss
$colorBg: ${iCfg.colorBg};
$colorTitle: ${iCfg.colorTitle};
`;
	write_file(fPath, fStr);
}

async function import_libs(libs: string[]): Promise<string[]> {
	const rLines: string[] = [];
	const ulibs = new Set(libs);
	const lengthDiff = libs.length - ulibs.size;
	if (lengthDiff !== 0) {
		console.log(`err412: ${lengthDiff} duplicated in libs list`);
		process.exit(1);
	}
	for (const libName of ulibs) {
		try {
			const pages = (await import(libName)) as tAllPageDef;
			const [cErr, cMsg] = checkImpPages(pages);
			if (cErr) {
				console.log(`err412: error by importing ${libName}`);
				console.log(cMsg);
				process.exit(1);
			}
			for (const one of Object.keys(pages)) {
				const partName = pages[one].pDef.partName;
				rLines.push(`\t'${libName}/${partName}': ${libName}.${one}`);
			}
		} catch (err) {
			console.log(`err456: error by importing ${libName}`);
			console.log(err);
			process.exit(1);
		}
	}
	return rLines;
}

function generate_designList(libs: string[], lines: string[], oPath: string) {
	let fStr = `// designList.ts

import type { tAllPageDef } from 'geometrix';
`;
	for (const onelib of libs) {
		fStr += `import * as ${onelib} from '${onelib}';\n`;
	}
	fStr += '\nconst designList: tAllPageDef = {\n';
	fStr += lines.join(',\n');
	fStr += '\n};\n\nexport { designList };\n';
	write_file(oPath, fStr);
}

async function generate_designList_ui(iCfg: tPaxAppConfig) {
	const fPath_ui = '../desiXY-ui/src/lib/designList.ts';
	const lines = await import_libs(iCfg.libs);
	generate_designList(iCfg.libs, lines, fPath_ui);
}

async function generate_designList_cli(iCfg: tPaxAppConfig) {
	const fPath_cli = '../desiXY-cli/src/designList.ts';
	const lines = await import_libs(iCfg.libs);
	generate_designList(iCfg.libs, lines, fPath_cli);
}

function get_package_version(pkgName: string): string {
	let rPkgVersion = '0.0.0';
	const pkgPath = `../../node_modules/${pkgName}/package.json`;
	const err_msg = `err303: the npm-package '${pkgName}' doesn't seem to be installed. Run: npm install`;
	const pkgStr = read_file(pkgPath, '.json', err_msg);
	try {
		const packageJson = JSON.parse(pkgStr) as tPackageJson;
		if (!(k_name in packageJson)) {
			throw `err120: JSON ${pkgPath} doesn't have the key '${k_name}'`;
		}
		const pkgName2 = packageJson[k_name];
		if (pkgName !== pkgName2) {
			throw `err121: JSON ${pkgPath} has unexpected name '${pkgName}' versus '${pkgName2}'`;
		}
		if (!(k_version in packageJson)) {
			throw `err122: JSON ${pkgPath} doesn't have the key '${k_version}'`;
		}
		rPkgVersion = packageJson[k_version];
	} catch (err) {
		console.log(`err116: error by parsing ${pkgPath}`);
		console.log(err);
		process.exit(1);
	}
	return rPkgVersion;
}

async function rewrite_packageJson(designLibs: string[], geomLibs: string[], pkgPath: string) {
	const lines = await import_libs(designLibs);
	console.log(`info234: Number of found designs: ${lines.length}`);
	const libs = geomLibs.concat(designLibs);
	libs.sort();
	const updatedDependencies: tDependencies = {};
	for (const onelib of libs) {
		const currVersion = get_package_version(onelib);
		updatedDependencies[onelib] = `^${currVersion}`;
	}
	const pkgStr = read_file(pkgPath, '.json');
	try {
		const packageJson = JSON.parse(pkgStr) as tDesiPackageJson;
		if (!(k_dependencies in packageJson)) {
			throw `err142: JSON ${pkgPath} doesn't have the key '${k_dependencies}'`;
		}
		packageJson[k_dependencies] = updatedDependencies;
		const pkgStr2 = JSON.stringify(packageJson, null, '\t') + '\n';
		write_file(pkgPath, pkgStr2);
	} catch (err) {
		console.log(`err156: error by parsing ${pkgPath}`);
		console.log(err);
		process.exit(1);
	}
}

async function rewrite_packageJson_ui(iCfg: tPaxAppConfig) {
	const fPath_ui = '../desiXY-ui/package.json';
	const geomlibs = ['geometrix', 'geomui'];
	await rewrite_packageJson(iCfg.libs, geomlibs, fPath_ui);
}

async function rewrite_packageJson_cli(iCfg: tPaxAppConfig) {
	const fPath_cli = '../desiXY-cli/package.json';
	const geomlibs = ['geometrix', 'geomcli'];
	await rewrite_packageJson(iCfg.libs, geomlibs, fPath_cli);
}

async function copy_pgdsvg(iCfg: tPaxAppConfig) {
	const destDir = '../desiXY-ui/static';
	const destDir2 = `${destDir}/pgdsvg`;
	if (!fs.existsSync(destDir)) {
		console.log(`err339: copy destination directory ${destDir} doesn't exist`);
		process.exit(1);
	}
	for (const onelib of iCfg.libs) {
		const srcDir = `../../node_modules/${onelib}/dist/pgdsvg`;
		if (!fs.existsSync(srcDir)) {
			console.log(`err338: directory ${srcDir} doesn't exist`);
			process.exit(1);
		}
		try {
			await fse.copy(srcDir, destDir2);
		} catch (err) {
			console.log(`err337: error by copying directory ${srcDir} to ${destDir2}`);
			console.log(err);
			process.exit(1);
		}
	}
}

async function generate_versionJson(designLibs: string[], geomLibs: string[], pkgPath: string) {
	const lines = await import_libs(designLibs);
	console.log(`info234: Number of found designs: ${lines.length}`);
	const libs = geomLibs.concat(designLibs);
	const versionJson: tDependencies = {};
	for (const onelib of libs) {
		const currVersion = get_package_version(onelib);
		versionJson[onelib] = `${currVersion}`;
	}
	const pkgStr = JSON.stringify(versionJson, null, '\t') + '\n';
	write_file(pkgPath, pkgStr);
}

async function generate_versionJson_ui(iCfg: tPaxAppConfig) {
	const fPath_ui = '../desiXY-ui/src/lib/versions.json';
	const geomlibs = ['geometrix', 'geomui', 'paxScr', 'desiXY-ui'];
	await generate_versionJson(iCfg.libs, geomlibs, fPath_ui);
}

function getPackageName(pkgPath: string): string {
	let rPkgName = '';
	const err_msg = `err268: error while reading the package.json of '${pkgPath}'`;
	const pkgStr = read_file(pkgPath, '.json', err_msg);
	try {
		const packageJson = JSON.parse(pkgStr) as tPackageJson;
		if (!(k_name in packageJson)) {
			throw `err273: JSON ${pkgPath} doesn't have the key '${k_name}'`;
		}
		rPkgName = packageJson[k_name];
	} catch (err) {
		console.log(`err278: error by parsing ${pkgPath}`);
		console.log(err);
		process.exit(1);
	}
	return rPkgName;
}

async function generate_versionJson_cli(iCfg: tPaxAppConfig) {
	const fPath_cli = '../desiXY-cli/src/versions.json';
	const desiXYcli_pkgName = getPackageName('../desiXY-cli/package.json');
	const geomlibs = ['geometrix', 'geomcli', 'paxScr', desiXYcli_pkgName];
	await generate_versionJson(iCfg.libs, geomlibs, fPath_cli);
}

function display_message() {
	const msg = `
info305: add '/paxApps/' to your '.gitignore' file for ignoring those degit packages
info306: re-run 'npm install' after degit 'paxApps' for generating the links in the directory 'node_modules'
`;
	console.log(msg);
}

async function genBindings_cli(iArgs: string[]) {
	//const argv = await yargs(hideBin(iArgs))
	await yargs(hideBin(iArgs))
		.scriptName('genBindings')
		.version(packag.version)
		.usage('Usage: $0 <global-options> command <command-argument>')
		.example([
			['$0 --topPackage ../../pachage.json print-config', 'print the paxApps config'],
			['$0 generate-scss', 'create the scss file for the sveltekit app'],
			['$0 generate-cli-design-list', 'create the designList.ts for desiXY-cli'],
			['$0 generate-ui-design-list', 'create the designList.ts for desiXY-ui'],
			['$0 modify-cli-package', 'modify the package.json of desiXY-cli'],
			['$0 modify-ui-package', 'modify the package.json of desiXY-ui'],
			['$0 copy-pgdsvg', 'copy the svg for the sveltekit app'],
			['$0 all', 'does all modifs and copies']
		])
		.option('topPackage', {
			type: 'string',
			description: 'path to the package.json of Parame',
			default: '../../package.json'
		})
		.command('print-config', 'print the paxApps config of the top package.json', {}, (argv) => {
			const cfg = getTopPackageJson(argv.topPackage as string);
			console.log(cfg);
		})
		.command('generate-scss', 'create the file gen_colors.scss for desiXY-ui', {}, (argv) => {
			const cfg = getTopPackageJson(argv.topPackage as string);
			generate_scss(cfg);
		})
		.command('print-libs', 'print the content of libs', {}, async (argv) => {
			const cfg = getTopPackageJson(argv.topPackage as string);
			const lines = await import_libs(cfg.libs);
			console.log(lines);
		})
		.command(
			'generate-designList-ui',
			'create the file designList.ts for desiXY-ui',
			{},
			async (argv) => {
				const cfg = getTopPackageJson(argv.topPackage as string);
				await generate_designList_ui(cfg);
			}
		)
		.command(
			'generate-designList-cli',
			'create the file designList.ts for desiXY-cli',
			{},
			async (argv) => {
				const cfg = getTopPackageJson(argv.topPackage as string);
				await generate_designList_cli(cfg);
			}
		)
		.command(
			'rewrite-packageJson-ui',
			'rewrite the file package.json of desiXY-ui for adding dependencies',
			{},
			async (argv) => {
				const cfg = getTopPackageJson(argv.topPackage as string);
				await rewrite_packageJson_ui(cfg);
			}
		)
		.command(
			'rewrite-packageJson-cli',
			'rewrite the file package.json of desiXY-cli for adding dependencies',
			{},
			async (argv) => {
				const cfg = getTopPackageJson(argv.topPackage as string);
				await rewrite_packageJson_cli(cfg);
			}
		)
		.command(
			'copy-pgdsvg',
			'copy the svg files of design libraries to desiXY-ui',
			{},
			async (argv) => {
				const cfg = getTopPackageJson(argv.topPackage as string);
				await copy_pgdsvg(cfg);
			}
		)
		.command(
			'generate-versionJson-ui',
			'generate the json-file with version information for desiXY-ui',
			{},
			async (argv) => {
				const cfg = getTopPackageJson(argv.topPackage as string);
				await generate_versionJson_ui(cfg);
			}
		)
		.command(
			'generate-versionJson-cli',
			'generate the json-file with version information for desiXY-cli',
			{},
			async (argv) => {
				const cfg = getTopPackageJson(argv.topPackage as string);
				await generate_versionJson_cli(cfg);
			}
		)
		.command('display-message', 'display usefull message for the build', {}, display_message)
		.command(
			'all',
			'all preparations for binding desiXY-cli and desiXY-ui',
			{},
			async (argv) => {
				const cfg = getTopPackageJson(argv.topPackage as string);
				generate_scss(cfg);
				await generate_designList_ui(cfg);
				await generate_designList_cli(cfg);
				await rewrite_packageJson_ui(cfg);
				await rewrite_packageJson_cli(cfg);
				await copy_pgdsvg(cfg);
				await generate_versionJson_ui(cfg);
				await generate_versionJson_cli(cfg);
				display_message();
			}
		)
		.demandCommand(1)
		.help()
		.strict()
		.parseAsync();
}

//console.log('genBindings.ts says hello!');
await genBindings_cli(process.argv);
//console.log('genBindings.ts says bye!');
