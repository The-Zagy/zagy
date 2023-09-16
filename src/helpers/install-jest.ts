import path from "path";
import fs from "fs/promises";
import type { Installer } from "./addones-types.js";
import { pkgRoot } from "../constants.js";
import { upsertField } from "./package-json.js";

export const jestInstaller: Installer = async ({ projectPath }) => {
    // generate the required paths to copy the files/configs of prisma to the new project path
    const configSrc = path.join(pkgRoot, "template/extra/jest/jest.config.ts");
    const configDest = path.join(projectPath, "jest.config.ts")

    const exampleSrc = path.join(pkgRoot, "template/extra/jest/__test__");
    const exampleDest = path.join(projectPath, "src/__test__");

    // copy files to the project
    await fs.cp(configSrc, configDest, );
    await fs.cp(exampleSrc, exampleDest, {recursive: true});

    // add dependecies and scripts for prisma
    const PackageJsonDest = path.join(projectPath, "package.json");
    await upsertField(PackageJsonDest, [
        ["devDependencies", "jest", "^29.7.0"],
        ["devDependencies", "@types/jest", "^29.5.5"],
        ["devDependencies", "ts-jest", "^29.1.1"],
        ["scripts", "test", "jest"],
    ]);
};
