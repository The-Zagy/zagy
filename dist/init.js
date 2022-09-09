import { TestChoise } from "./types.js";
import { exec } from "child_process";
import util from "node:util";
import fs from "fs/promises";
import path from "path";
const promiseExec = util.promisify(exec);
function packageJson(name, test) {
    return `{
        "name": "${name}",
        "version": "1.0.0",
        "type":"module",
        "description": "",
        "main": "dist/index.js",
        "scripts": {
            "start": "node  ./dist/index.js",
            "build": "tsc --watch --preserveWatchOutput",
            "dev": "nodemon  dist/index ",
            "ts": "ts-node-esm src/index.ts",
            "test": "${test}",
            "prettier":"prettier --config .prettierrc \\"src/**/*.ts\\" --write",
            "lint":"eslint . --ext .ts"
        },
        "keywords": [],
        "author": "",
        "license": "ISC"  
    }`;
}
function tsconfigJson() {
    return `{
        "compilerOptions": {
            "target": "es2021",
            "module": "ES2022",
            "lib": [
                "dom",
                "es2021"
            ],
            "sourceMap": false,
            "outDir": "dist",
            "rootDir": "src",
            "strict": true,
            "types": [
                "node"
            ],
            "esModuleInterop": true,
            "moduleResolution": "node",
            "resolveJsonModule": true,
            "baseUrl": ".",
            "allowSyntheticDefaultImports": true,
            "noUnusedLocals": true,
            "noUnusedParameters": true,
            "noImplicitReturns": true,
            "noFallthroughCasesInSwitch": true,
            "removeComments": true,
            "allowJs": true
        },
        "include":["src"],
        "exclude":["node_modules"]
    }`;
}
function prettierJson() {
    return `
    {
        "semi": true,
        "trailingComma": "none",
        "singleQuote": true,
        "printWidth": 80
    }`;
}
function eslintJson() {
    return `
    {
        "root": true,
        "plugins": [
          "prettier",
          "@typescript-eslint"
        ],
        "extends": [
          "eslint:recommended",
          "prettier",
          "plugin:@typescript-eslint/recommended"
        ],
        "parser": "@typescript-eslint/parser",
        "rules": {
          "prettier/prettier": 2 ,
          "no-use-before-define": ["error", { "functions": true, "classes": true }],
          "no-var": "error",
          "prefer-const": "error"
        },
        "parserOptions": {
          "ecmaVersion": 2021
        },
        "env": {
          "node": true,
          "es6": true
        }
    }
    `;
}
function jasmineJson() {
    return `
    {
        "spec_dir": "dist/__tests__",
        "spec_files": [
          "**/*[sS]pec.?(m)js",
          "!**/*nospec.js"
        ],
        "helpers": [
          "helpers/**/*.?(m)js"
        ],
        "env": {
          "failSpecWithNoExpectations": false,
          "stopSpecOnExpectationFailure": false,
          "stopOnSpecFailure": false,
          "random": false
        }
      }
    `;
}
function reporterJson() {
    return `import {DisplayProcessor, SpecReporter, StacktraceOption} from "jasmine-spec-reporter";
    import SuiteInfo = jasmine.SuiteInfo;
    
    class CustomProcessor extends DisplayProcessor {
        public displayJasmineStarted(info: SuiteInfo, log: string): string {
            return ${"`${log}`"};
        }
    }
    
    jasmine.getEnv().clearReporters();
    jasmine.getEnv().addReporter(new SpecReporter({
        spec: {
            displayStacktrace: StacktraceOption.NONE
        },
        customProcessors: [CustomProcessor],
    }));`;
}
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
    await fs.writeFile(path.resolve("package.json"), packageJson(FName, test));
    console.log(`package.json created ...`);
    await fs.writeFile(path.resolve("tsconfig.json"), tsconfigJson());
    console.log(`tsconfig.json created ...`);
    await fs.writeFile(path.resolve(".prettierrc"), prettierJson());
    console.log(`.prettierrc created ...`);
    await fs.writeFile(path.resolve(".eslintrc"), eslintJson());
    console.log(`.eslintrc created ...`);
}
async function installDependencies() {
    console.log(`INSTALLING PROJECT DEPENDENCIES DON'T PANIC ...`);
    const { stdout, stderr } = await promiseExec("npm i --save-dev typescript eslint prettier @types/node @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-prettier");
    if (stderr) {
        throw new Error(stderr);
    }
    console.log(stdout);
}
async function jasmineAntomy() {
    await fs.mkdir(path.resolve("spec/support"), { recursive: true });
    console.log(`spec ctrated ...`);
    await fs.writeFile(path.resolve("spec/support/jasmine.json"), jasmineJson());
    console.log(`jasmine.json created ...`);
    await fs.mkdir(path.resolve("src/__tests__/helpers"), { recursive: true });
    console.log(`__tests__ ctrated ...`);
    await fs.writeFile(path.resolve("src/__tests__/helpers/reporter.ts"), reporterJson());
    console.log(`reporter created ...`);
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
export default async function initProject(FName, test) {
    try {
        await createProjectAntomy(FName, test);
        await installDependencies();
        console.log(`NOTE => our testing configuration test the compiled Javascript`);
        if (test === TestChoise.JASMINE) {
            await jasmineTest();
        }
        else {
            console.log("jest");
        }
        console.log("Your Project Has Been Created Successfully, Happy Coding");
    }
    catch (err) {
        console.log(err);
    }
}
