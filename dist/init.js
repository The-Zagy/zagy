import { TestChoise } from "./types.js";
import { exec } from "child_process";
import util from "node:util";
import fs from "fs/promises";
import path from "path";
import * as jsonConfig from "./configjson.js";
const promiseExec = util.promisify(exec);
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
async function installDependencies() {
    console.log(`INSTALLING PROJECT DEPENDENCIES DON'T PANIC ...`);
    const { stdout, stderr } = await promiseExec("npm i --save-dev ts-node typescript eslint prettier nodemon @types/node @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-prettier");
    if (stderr) {
        throw new Error(stderr);
    }
    console.log(stdout);
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
async function jasmineTest() {
    console.log(`INSTALLING JASMINE DEPENDENCCIES DON'T PANIC ...`);
    const { stdout, stderr } = await promiseExec("npm i --save-dev jasmine jasmine-spec-reporter @types/jasmine");
    if (stderr) {
        console.log(stderr);
    }
    console.log(stdout);
    await jasmineAntomy();
}
async function jestAntomy() {
    await fs.mkdir(path.resolve("src/__tests__"));
    console.log(`__tests__ ctrated ...`);
    await fs.writeFile(path.resolve("jest.config.json"), jsonConfig.jestJson());
    console.log(`jest.config.js created ...`);
    await fs.writeFile(path.resolve("src/__tests__/index.spec.ts"), `//sample test`);
    console.log(`index.spec.ts created ...`);
}
async function jestTest() {
    console.log(`INSTALLING JEST DEPENDENCCIES DON'T PANIC ...`);
    const { stdout, stderr } = await promiseExec("npm i --save-dev jest @types/jest cross-env");
    if (stderr) {
        console.log(stderr);
    }
    console.log(stdout);
    await jestAntomy();
}
export default async function initProject(FName, test) {
    try {
        await createProjectAntomy(FName, test);
        await installDependencies();
        console.log(`NOTE => our testing configuration test the compiled Javascript`);
        if (test === TestChoise.JASMINE) {
            await jasmineTest();
        }
        else {
            await jestTest();
        }
        console.log("Your Project Has Been Created Successfully, Happy Coding");
    }
    catch (err) {
        console.log(err);
    }
}
