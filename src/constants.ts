import { fileURLToPath } from 'url';
import {resolve } from 'path';
// dist path
export const __dirname = fileURLToPath(new URL('.', import.meta.url));

// root path
export const pkgRoot = resolve(__dirname, '../')