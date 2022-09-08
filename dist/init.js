import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
function packageJson(name) {
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
            "test": "jasmine"
            
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
function installDependencies() {
    exec("npm i --save-dev typescript eslint prettier @types/node @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-prettier ", (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        if (stderr) {
            throw new Error(stderr);
        }
        console.log(stdout);
    });
}
export default async function initProject(FName) {
    try {
        const folderPath = path.resolve(FName);
        console.log(`initing your project in ${folderPath} .... `);
        await fs.mkdir(folderPath);
        process.chdir(FName);
        console.log(path.resolve());
        await fs.mkdir(path.resolve("src"));
        console.log(`src ctrated ...`);
        await fs.writeFile(path.resolve("src", "index.ts"), `console.log("HI IT'S ZAGY")`);
        console.log(`index.ts created ...`);
        await fs.writeFile(path.resolve("package.json"), packageJson(FName));
        console.log(`package.json created ...`);
        await fs.writeFile(path.resolve("tsconfig.json"), tsconfigJson());
        console.log(`tsconfig.json created ...`);
        await fs.writeFile(path.resolve(".prettierrc"), prettierJson());
        console.log(`.prettierrc created ...`);
        await fs.writeFile(path.resolve(".prettierrc"), prettierJson());
        console.log(`.prettierrc created ...`);
        await fs.writeFile(path.resolve(".eslintrc"), eslintJson());
        console.log(`.eslintrc created ...`);
        installDependencies();
    }
    catch (err) {
        console.log(err);
    }
}
