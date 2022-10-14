import { TestChoise } from "./types.js";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import * as jsonConfig from "./configjson.js";
async function createProjectAntomy(FName, test) {
    const folderPath = path.resolve(FName);
    console.log(`initing your project in ${folderPath} .... `);
    await fs.mkdir(folderPath);
    process.chdir(FName);
    console.log(path.resolve());
    await fs.mkdir(path.resolve("src"));
    console.log(`src ctrated ...`);
    await fs.writeFile(path.resolve("src", "index.ts"), `console.log("HI IT'S ZAGY")`);
    console.log(`index.ts created ...`);
    await fs.writeFile(path.resolve(".gitignore"), jsonConfig.gitignoreJson());
    console.log(`.gitignore created ...`);
    await fs.writeFile(path.resolve("package.json"), jsonConfig.packageJson(FName, test));
    console.log(`package.json created ...`);
    await fs.writeFile(path.resolve("tsconfig.json"), jsonConfig.tsconfigJson(test));
    console.log(`tsconfig.json created ...`);
    await fs.writeFile(path.resolve(".prettierrc"), jsonConfig.prettierJson());
    console.log(`.prettierrc created ...`);
    await fs.writeFile(path.resolve(".eslintrc"), jsonConfig.eslintJson());
    console.log(`.eslintrc created ...`);
}
function installDependencies(testDep) {
    let shell = 'npm i --save-dev ts-node typescript eslint prettier nodemon @types/node @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-prettier' + ' ' + testDep;
    console.log(`INSTALLING PROJECT DEPENDENCIES DON'T PANIC ...`);
    spawn(shell, { stdio: "inherit", shell: true });
}
async function jasmineAntomy() {
    await fs.mkdir(path.resolve("spec/support"), { recursive: true });
    console.log(`spec ctrated ...`);
    await fs.writeFile(path.resolve("spec/support/jasmine.json"), jsonConfig.jasmineJson());
    console.log(`jasmine.json created ...`);
    await fs.mkdir(path.resolve("src/__tests__/helpers"), { recursive: true });
    console.log(`__tests__ ctrated ...`);
    await fs.writeFile(path.resolve("src/__tests__/helpers/reporter.ts"), jsonConfig.reporterJson());
    console.log(`reporter created ...`);
    await fs.writeFile(path.resolve("src/__tests__/indexSpec.ts"), `//sample test`);
    console.log(`indexSpec.ts created ...`);
}
function jasmineTestDep() {
    return 'jasmine jasmine-spec-reporter @types/jasmine';
}
async function jestAntomy() {
    await fs.mkdir(path.resolve("src/__tests__"));
    console.log(`__tests__ ctrated ...`);
    await fs.writeFile(path.resolve("jest.config.json"), jsonConfig.jestJson());
    console.log(`jest.config.js created ...`);
    await fs.writeFile(path.resolve("src/__tests__/index.spec.ts"), `//sample test`);
    console.log(`index.spec.ts created ...`);
}
function jestTestDep() {
    return 'jest @types/jest cross-env';
}
export default async function initProject(FName, test) {
    try {
        let testDep = '';
        await createProjectAntomy(FName, test);
        console.log(`NOTE => our testing configuration test the compiled Javascript`);
        if (test === TestChoise.JASMINE) {
            await jasmineAntomy();
            testDep = jasmineTestDep();
        }
        else {
            await jestAntomy();
            testDep = jestTestDep();
        }
        console.log("Your Project Antomy Has Been Created Successfully Now Installing Dependencies, Happy Coding");
        installDependencies(testDep);
    }
    catch (err) {
        console.log(err);
    }
}
