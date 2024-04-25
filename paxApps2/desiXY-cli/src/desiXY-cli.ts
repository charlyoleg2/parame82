#!/usr/bin/env node
// desiXY-cli.ts

import { geom_cli } from 'geomcli';
import packag from '../package.json';
import { designList } from './designList';

//console.log('desiXY-cli says hello');
await geom_cli(process.argv, designList, packag, 'output');
//console.log('desiXY-cli says bye');
