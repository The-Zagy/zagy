import fs from "fs/promises";

// type contains basic properties of the package.json file
type PackageJsonMeta = {
    name: string;
    version: string;
    description: string;
    main: string;
    type: string;
};
export type PackageJson = {
    scripts: {
        [k: string]: string;
    };
    dependencies: {
        [k: string]: string;
    };
    devDependencies: {
        [k: string]: string;
    };
} & PackageJsonMeta;

/**
 *  update one field from package.json which type is string
 * @param path package.json path
 * @param name field to update name, NOTE THOSE ONLY ARE THE FIELDS THAT THERE'S TYPE IS STRING
 * @param value value to be inserted
 */
export const updateField = async (
    path: string,
    nameValue: [keyof PackageJsonMeta, string][]
): Promise<void> => {
    const pkj = await fs.readFile(path, { encoding: "utf-8" });
    const pkjParsed = JSON.parse(pkj) as PackageJson;
    for (const field of nameValue) {
        pkjParsed[field[0]] = field[1];
    }
    const pkjStringified = JSON.stringify(pkjParsed, null, 2);
    await fs.writeFile(path, pkjStringified);
};

/**
 * update or add one field to the package.json fields that follows the shape {[k: string]: string} like scripts ...
 * @param path package.json path
 * @param name field to upsert in name
 * @param key key to be added/modified
 * @param value value to ve added
 */
export const upsertField = async (
    path: string,
    nameKeyValue: [
        "scripts" | "dependencies" | "devDependencies",
        string,
        string
    ][]
): Promise<void> => {
    const pkj = await fs.readFile(path, { encoding: "utf-8" });
    const pkjParsed = JSON.parse(pkj) as PackageJson;
    for (const field of nameKeyValue) {
        pkjParsed[field[0]][field[1]] = field[2];
    }
    const pkjStringified = JSON.stringify(pkjParsed, null, 2);
    await fs.writeFile(path, pkjStringified);
};
// type PackageJsonOp  = {
//     [key in keyof PackageJson]?: PackageJson[key];
// };
// export const updatePackageJson = async (
//     path: string,
//     fields: PackageJsonOp
// ): Promise<void> => {
//     const pkj = await fs.readFile(path, { encoding: "utf-8" });
//     const pkjParsed = JSON.parse(pkj) as PackageJson;
//     let key: keyof PackageJson;
//     for (key in fields) {
//         if (
//             fields[key] !== undefined &&
//             typeof fields[key] === "string" &&
//             typeof pkjParsed[key] === "string"
//         ) {
//             pkjParsed[key as keyof PackageJsonMeta] =
//                 fields[key as keyof PackageJsonMeta];
//         }
//     }
// };
