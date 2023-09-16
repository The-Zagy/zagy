#! /usr/bin/env node
import { Command } from 'commander';
import createApp from './init.js'
//chalk, inqurier, gradient, chalkAnimation, nanospinner

const main = async () => {
    const program = new Command();
    program
        .name('zagy')
        .description('utils');
    
    // create command 
    program.command('create')
        .alias('init')
        .description('create barebone node.js app configured with eslint prettier jest and some other options')
        .argument('[project name]', 'new project name')
        .action((projectName?: string) => {
            createApp(projectName);
        });
    
    // badcss command 
    program.command('badcss')
        .alias('css')
        .description('change css values')
        .action(() => {

        });
    
    program.parse();
}

await main();