import { Config } from "jest";
/** @type {import('ts-jest').JestConfigWithTsJest} */
const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    transform: {},
    moduleFileExtensions: ["js", "ts", "tsx", "json", "node"],
    modulePathIgnorePatterns: ["node_modules"],
};
export default config;
