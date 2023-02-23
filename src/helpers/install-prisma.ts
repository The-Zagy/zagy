import path from "path";
import fs from "fs/promises";
import type { Installer } from "./addones-types";
import { pkgRoot } from "../constants.js";
import { upsertField } from "./package-json.js";

export const prismaInstaller: Installer = async ({ projectPath }) => {
    // generate the required paths to copy the files/configs of prisma to the new project path
    const schemaSrc = path.join(pkgRoot, "template/extra/prisma");
    const schemaDest = path.join(projectPath, "prisma")

    const clientSrc = path.join(pkgRoot, "template/extra/prisma-client.ts");
    const clientDest = path.join(projectPath, "src/prisma-client.ts");

    const exampleSrc = path.join(pkgRoot, "template/extra/prisma-example.ts");
    const exampleDest = path.join(projectPath, "src/prisma-example.ts");

    // copy files to the project
    await fs.cp(schemaSrc, schemaDest, {recursive: true});
    await fs.copyFile(clientSrc, clientDest);
    await fs.copyFile(exampleSrc, exampleDest);

    // add dependecies and scripts for prisma
    const PackageJsonDest = path.join(projectPath, "package.json");
    await upsertField(PackageJsonDest, [
        ["devDependencies", "prisma", "^4.10.0"],
        ["scripts", "db:studio", "prisma studio"],
        ["scripts", "db:migrate", "prisma migrate dev --name"],
    ]);
};
