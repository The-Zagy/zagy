import { jestInstaller } from "./install-jest.js";
import { prismaInstaller } from "./install-prisma.js";

// todo add to the signature "packagesOpts" to be used if the package installer will do someting different if it was with another package
export type Installer = (config: { projectPath: string }) => Promise<void>;

export const availableAddOnes = ["prisma", "jest"] as const;
//TODO support deez nuts
// export const availableAddOnes = ["prisma", "express", "fastify", "jest", "vitest"] as const;

type AvailableAddOnesInstallerMap = {
    [key in typeof availableAddOnes[number]]: Installer;
};
export const availableAddOnesInstallerMap: AvailableAddOnesInstallerMap = {
    prisma: prismaInstaller,
    jest: jestInstaller
} as const;
