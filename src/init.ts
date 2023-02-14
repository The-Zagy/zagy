/**
 * zagy --init -f[f for folderName], How it works =>
 * log initializing project path 
 * mkdir -f
 * cp template/base new-path
 * TODO make the user choose the extra needed for the project
 * TODO ask about git
 * ask if the user want to install dependecies
 */

import { execFileSync } from "child_process";
import inquirer from "inquirer";
// import util from "node:util"
import fs from "fs/promises"
import path from "path"
import { pkgRoot } from "./constants.js";

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
// const promiseExec = util.promisify(exec)
// const promiseSpawn = util.promisify(spawn)

async function copyBaseTemplate(newProjectPath: string): Promise<void> {
    // make folder and copy
    await fs.mkdir(newProjectPath);
    await fs.cp(path.join(pkgRoot, 'template/base'), newProjectPath, {recursive: true});

    // in the template .gitignore is renamed to tempGitIgnore to not affect the package git tree but it must be rename to the user to work as intended
    await fs.rename(path.join(newProjectPath, 'tempGitIgnore'), path.join(newProjectPath, '.gitignore'));
}

function isUnderGit(folderPath: string): boolean {
    try {
        execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {cwd: folderPath, stdio: "ignore"});
        console.log('under git');
        return true;
    } catch(e) {
        console.error('error not under git')
        return false;
    }
}

function initGit(folderPath: string) {
    execFileSync('git', ['init'], {cwd: folderPath, stdio: "ignore"});
    execFileSync('git', ['add', '.'], {cwd: folderPath, stdio: "ignore"});
}

// function installDependencies(testDep: string): void {
    //change process dir to the new folder
    // process.chdir(FName)
    // console.log(path.resolve())
//     let shell = 'npm i --save-dev ts-node typescript eslint prettier nodemon @types/node @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-prettier' + ' ' + testDep;
//     console.log(`INSTALLING PROJECT DEPENDENCIES DON'T PANIC ...`)
//     // const {stdout , stderr} = await promiseExec("npm i --save-dev ts-node typescript eslint prettier nodemon @types/node @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-prettier")
//     // if (stderr){
//     //     throw new Error(stderr)
//     // }
//     // console.log(stdout)
//     //*switched to spawn to use its feature to stream the ouput instead of buffering the output and then show it to the user
//     //* and also changed executing more than shell now the main method send to @installDependencies the packages required for testing and we install all of them in the same shell => the next spawn is what i mean with shell
//     spawn(shell, { stdio: "inherit", shell: true });
// }

interface ProjectMetaDataAnswers {
    projectName: string;
    initGit: boolean;
}
// if the project name already was supplied to the functions won't ask again about the name
async function questionsSession(projectName?: string){
    
    const answers = await inquirer.prompt<ProjectMetaDataAnswers>([
        {
        name: 'projectName',
        type: 'input',
        message: 'project name',
        default: 'zagy-app',
        },
        {
            name: 'initGit',
            type: 'confirm',
            message: 'do you want to init git repo',
            default: true
        }
    ], {projectName})
    console.log("🪵 file \"init.ts\" ~  line \"73\" ~ token ~ answers = ", answers);
    return answers
}

/**
 * function to initalize project with that form 
 * [
 * ]
 * 
 * @param FName folder name
 */
export default async function initProject(FName?: string): Promise<void> {
    try {
        const answers = await questionsSession(FName);
        const newProjectPath = path.resolve(answers.projectName);

        //create project folders and config files
        await copyBaseTemplate(newProjectPath);

        if (answers.initGit) {
            if (!isUnderGit(newProjectPath)) {
                initGit(newProjectPath);
            } else {
                console.error('already under git repo');
            }
        }
        // TODO install node dependencies
        // installDependencies(testDep)
    } catch (err) {
        console.log(err);
    }
}