#! /usr/bin/env node
import fs from "fs/promises";
import path from "path";
import inquirer from "inquirer";
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import yargs from "yargs";
import { TestChoise } from "./types.js";
import INIT from "./init.js";
const processCssFile = async (cssFilePath, outputCssPath, referenceSize) => {
    try {
        const content = await fs.readFile(cssFilePath, "utf-8");
        const words = content.split("\n");
        let newCss = words.map(line => {
            if (line.trim().startsWith("font-size")) {
                let temp = line.split(":")[1];
                if (temp !== null) {
                    let val = temp.match(/\d+/);
                    if (val) {
                        let newRemVal = +val[0] / referenceSize;
                        return `font-size:${newRemVal}rem;`;
                    }
                }
            }
            return line;
        });
        let returned = newCss.join('\n');
        try {
            await fs.writeFile(outputCssPath, returned);
        }
        catch (err) {
            throw new Error('Something terribly bad have happend');
        }
    }
    catch (err) {
        throw new Error('Something wrong happend');
    }
};
const prompts = async () => {
    inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);
    try {
        const mainPrompts = await inquirer.prompt([{
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
            },
            {
                type: "input",
                name: "newCssFileName",
                message: "What do you want to call your css output file",
                default: "output"
            },
            {
                type: "number",
                name: "referenceValue",
                message: "Please choose your reference value(in pixels) defaults to 14px",
                default: 14
            }]);
        mainPrompts.outputPath = path.join(mainPrompts.outputPath, mainPrompts.newCssFileName + '.css');
        while (mainPrompts.cssFilePath === mainPrompts.outputPath) {
            const askForOverwrite = await inquirer.prompt([{
                    type: "confirm",
                    name: "overwrite",
                    message: "This file already exists do you want to overwrite it?",
                    default: false
                }
            ]);
            if (askForOverwrite.overwrite)
                break;
            const askForNewPath = await inquirer.prompt([
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
            ]);
            mainPrompts.outputPath = path.join(askForNewPath.outputPath, askForNewPath.newCssFileName + '.css');
        }
        return mainPrompts;
    }
    catch (err) {
        throw new Error(err);
    }
};
const main = async () => {
    const { argv } = yargs(process.argv).option("init", { demandOption: false, type: "string" });
    if ("init" in argv && typeof argv["init"] === "string") {
        if (!(argv["init"].length > 0))
            throw new Error("Please supply a folder name");
        if ("t" in argv && argv["t"] === "jasmine") {
            INIT(argv["init"], TestChoise.JASMINE);
        }
        else {
            INIT(argv["init"], TestChoise.JEST);
        }
    }
    else {
        let answers = await prompts();
        console.log(answers);
        processCssFile(answers.cssFilePath, answers.outputPath, answers.referenceValue);
    }
};
main();
