// Copies the 3D site build (creative/dist, built with base /3d) into the classic build
// so a single folder — pro/dist — can be deployed: classic at /, 3D at /3d/.
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const from = join(root, 'creative', 'dist');
const to = join(root, 'pro', 'dist', '3d');

if (!existsSync(from) || !existsSync(join(root, 'pro', 'dist'))) {
  console.error('Build both sites first (npm run build -w pro && npm run build -w creative).');
  process.exit(1);
}

rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
console.log(`Merged creative/dist → pro/dist/3d`);
