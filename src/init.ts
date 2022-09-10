/**
 * zagy --init -f[f for folderName]
 * log initializing project path 
 * mkdir -f
 * cd -f
 * mkdir src
 * touch src/index.ts
 * create package.json from hardcoded string [npm init -y] 
//  * TODO add scripts to package.json
 * npm i --save-dev typescript @types/node eslint prettier eslint-config-prettier eslint-plugin-prettier
 * hardcode .eslintrc for TS
 * hardcode .prettierrc 
 * TODO let the user choose between jest and jasmine 
 */
import {TestChoise} from "./types.js"
import {exec} from "child_process"
import util from "node:util"
import fs from "fs/promises"
import path from "path"
import * as jsonConfig from "./configjson.js"
/**
 *  * util.promisify(FUNCTION) 
 * take a function that follows the callback (err,value) as its last argument and return promise version of it
 * so we're using the promisfy version of child_process.exec to keep the async await core in the code
 * * from nodejs docs https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
 * If this method is invoked as its util.promisify()ed version, it returns a Promise for an Object with stdout and stderr properties. 
 * The returned ChildProcess instance is attached to the Promise as a child property. In case of an error (including any error 
 * resulting in an exit code other than 0), a rejected promise is returned, with the same error object given in the callback, but 
 * with two additional properties stdout and stderr.
 */
const promiseExec = util.promisify(exec)

async function createProjectAntomy(FName:string,test:TestChoise):Promise<void>{
    const folderPath= path.resolve(FName)
    console.log(`initing your project in ${folderPath} .... `)
    await fs.mkdir(folderPath)
    //change process dir to the new folder
    process.chdir(FName)
    console.log(path.resolve())
    //complete the init process
    await fs.mkdir(path.resolve("src"))
    console.log(`src ctrated ...`)
    await fs.writeFile(path.resolve("src","index.ts"),`console.log("HI IT'S ZAGY")`)
    console.log(`index.ts created ...`)
    await fs.writeFile(path.resolve(".gitignore"),jsonConfig.gitignoreJson())
    console.log(`.gitignore created ...`)
    await fs.writeFile(path.resolve("package.json"),jsonConfig.packageJson(FName,test))
    console.log(`package.json created ...`)
    await fs.writeFile(path.resolve("tsconfig.json"),jsonConfig.tsconfigJson(test))
    console.log(`tsconfig.json created ...`)
    await fs.writeFile(path.resolve(".prettierrc"),jsonConfig.prettierJson())
    console.log(`.prettierrc created ...`)
    await fs.writeFile(path.resolve(".eslintrc"),jsonConfig.eslintJson())
    console.log(`.eslintrc created ...`)
}
async function installDependencies():Promise<void>{
    console.log(`INSTALLING PROJECT DEPENDENCIES DON'T PANIC ...`)
    const {stdout , stderr} = await promiseExec("npm i --save-dev ts-node typescript eslint prettier nodemon @types/node @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-prettier")
    if (stderr){
        throw new Error(stderr)
    }
    console.log(stdout)
}
async function jasmineAntomy():Promise<void>{
    await fs.mkdir(path.resolve("spec/support"),{recursive:true})
    console.log(`spec ctrated ...`)
    await fs.writeFile(path.resolve("spec/support/jasmine.json"),jsonConfig.jasmineJson())
    console.log(`jasmine.json created ...`)
    await fs.mkdir(path.resolve("src/__tests__/helpers"),{recursive:true})
    console.log(`__tests__ ctrated ...`)
    await fs.writeFile(path.resolve("src/__tests__/helpers/reporter.ts"),jsonConfig.reporterJson())
    console.log(`reporter created ...`)
    await fs.writeFile(path.resolve("src/__tests__/indexSpec.ts"),`//sample test`)
    console.log(`indexSpec.ts created ...`)
}
async function jasmineTest():Promise<void>{
    console.log(`INSTALLING JASMINE DEPENDENCCIES DON'T PANIC ...`)
    const {stdout , stderr} = await promiseExec("npm i --save-dev jasmine jasmine-spec-reporter @types/jasmine")
    if(stderr){
        console.log(stderr)
    }
    console.log(stdout)
    await jasmineAntomy()
}
async function jestAntomy():Promise<void>{
    await fs.mkdir(path.resolve("src/__tests__"))
    console.log(`__tests__ ctrated ...`)
    await fs.writeFile(path.resolve("jest.config.json"),jsonConfig.jestJson())
    console.log(`jest.config.js created ...`)
    await fs.writeFile(path.resolve("src/__tests__/index.spec.ts"),`//sample test`)
    console.log(`index.spec.ts created ...`)
}
async function jestTest():Promise<void>{
    console.log(`INSTALLING JEST DEPENDENCCIES DON'T PANIC ...`)
    const {stdout , stderr} = await promiseExec("npm i --save-dev jest @types/jest cross-env")
    if(stderr){
        console.log(stderr)
    }
    console.log(stdout)
    await jestAntomy()
}
/**
 * function to initalize project with that form 
 * [
 * ]
 * 
 * @param FName 
 * @param test 
 */
export default async function initProject (FName:string,test:TestChoise):Promise<void>{
    try{
        //create project folders and config files
        await createProjectAntomy(FName,test)
        // install node dependencies
        await installDependencies()
        console.log(`NOTE => our testing configuration test the compiled Javascript`)
        if(test=== TestChoise.JASMINE) {
        await jasmineTest()
        }else {
            await jestTest()
        }
        console.log("Your Project Has Been Created Successfully, Happy Coding")
    }catch(err){
        console.log(err)
    }
}