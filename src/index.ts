#! /usr/bin/env node
import fs from "fs/promises";
// import { isFile, isDirectory } from 'path-type';
import path from "path";
import inquirer from "inquirer";
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt'
import yargs from "yargs";
import { TestChoise } from "./types.js";
import INIT from "./init.js"
//chalk, inqurier, gradient, chalkAnimation, nanospinner

const processCssFile = async (cssFilePath: string, outputCssPath: string, referenceSize: number): Promise<void> => {

    try {
        const content = await fs.readFile(cssFilePath, "utf-8");
        const words = content.split("\n");
        let newCss: string[] = words.map(line => {
            if (line.trim().startsWith("font-size")) {
                let temp = line.split(":")[1]
                if (temp !== null) {
                    let val = temp.match(/\d+/);
                    if (val) {
                        let newRemVal = +val[0] / referenceSize;
                        return `font-size:${newRemVal}rem;`
                    }
                }
            }
            return line;
        });
        let returned = newCss.join('\n');
        try { await fs.writeFile(outputCssPath, returned) }
        catch (err) {
            throw new Error('Something terribly bad have happend')
        }

    }
    catch (err) {
        throw new Error('Something wrong happend');
    }
}

// async function CLI(): Promise<void> {

//     const { argv } = yargs(process.argv)
//     console.log(argv)
//     if (!("path" in argv) && !("ref" in argv) && !("target" in argv)) {
//         console.log("you must type --path , --ref and --target")
//     }
//     else {
//         if (!(typeof argv['path'] === 'string' || typeof argv["ref"] !== "number") || typeof argv["target"] !== "string") throw new Error("Error");
//         let isfile = await isFile(argv["path"] as string);
//         if (!isfile) {
//             throw new Error('Path is not to a file');
//         }
//         isfile = await isDirectory(argv["target"] as string);
//         if (!isfile) {
//             throw new Error('target is not to a DIR');
//         }
//         processCssFile(argv["path"] as string, argv["target"] as string, argv['ref'] as number)
//     }

// }

const prompts = async (): Promise<{ cssFilePath: string, outputPath: string, newCssFileName: string, referenceValue: number }> => {
    //Add the fuzzy path plugin
    inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)
    try {
        const mainPrompts: { cssFilePath: string, outputPath: string, newCssFileName: string, referenceValue: number } = await inquirer.prompt(
            [{
                type: 'file-tree-selection',
                name: 'cssFilePath',
                validate: (item) => {
                    return item.includes('.css') ? true : "Please choose a css file";
                },

                enableGoUpperDirectory: true,
                message: "Select The css file you want to process"

            },
            {
                type: 'file-tree-selection',
                name: 'outputPath',
                onlyShowDir: true,
                message: "Select Where to save the new file"
            }
                , {
                type: "input",
                name: "newCssFileName",
                message: "What do you want to call your css output file",
                default: "output"
            }
                , {
                type: "number",
                name: "referenceValue",
                message: "Please choose your reference value(in pixels) defaults to 14px",
                default: 14
            }]
        )
        mainPrompts.outputPath = path.join(mainPrompts.outputPath, mainPrompts.newCssFileName + '.css');
        while (mainPrompts.cssFilePath === mainPrompts.outputPath) {
            const askForOverwrite: { overwrite: boolean } = await inquirer.prompt([{
                type: "confirm",
                name: "overwrite",
                message: "This file already exists do you want to overwrite it?",
                default: false
            }
            ])
            if (askForOverwrite.overwrite) break;
            const askForNewPath: { outputPath: string, newCssFileName: string } = await inquirer.prompt([
                {
                    type: 'file-tree-selection',
                    name: 'outputPath',
                    onlyShowDir: true,
                    message: "Select Where to save the new file"
                }, {
                    type: "input",
                    name: "newCssFileName",
                    message: "What do you want to call your css output file",
                    default: "output"
                }
            ])
            mainPrompts.outputPath = path.join(askForNewPath.outputPath, askForNewPath.newCssFileName + '.css');

        }
        return mainPrompts;
    }

    catch (err) {
        throw new Error(err as string);
    }

}


const main = async () => {
    //init yargs
    const {argv} = yargs(process.argv).option("init", {demandOption: true, type: "string"})
    /**
     * only do init project if the user supplied --init FOLDERNAME to the cli anything else open badcss cli
     * if the user add -t to the cli can choose which testing option the project will work with the default is jest 
     * there's only two options till now [jasmine , jest]
     * * EXAMBLE
    //  *  zagy --init project   [will work with jest]
    // *   zagy --init project -t jest   [will work with jest]
    // *   zagy --init project -t jasmine [will work with jasmine]
     */
    if("init" in argv && typeof argv["init"] === "string") {
        if("t" in argv && argv["t"] === "jasmine"){
            INIT(argv["init"],TestChoise.JASMINE)
        }else {
            INIT(argv["init"],TestChoise.JEST)
        }
    }
    else {
        let answers = await prompts();
        console.log(answers)
        processCssFile(answers.cssFilePath, answers.outputPath, answers.referenceValue);}
}
main();