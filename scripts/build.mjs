import { readFile, mkdir, copyFile, stat, rm } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const context = {};
vm.runInNewContext((await readFile('catalog.js', 'utf8')) + '\nthis.games = GAMES_CATALOG;', context);
const files = new Set(['index.html', 'player.html', 'style.css', 'app.js', 'player.js', 'catalog.js']);
for (const game of context.games) {
  files.add(game.rom);
  files.add(game.cover);
}
const output = path.resolve(root, 'dist');
if (output !== path.join(root, 'dist')) throw new Error('DiretÛrio de saÌda inv·lido');
await rm(output, { recursive: true, force: true });
let total = 0;
for (const file of files) {
  const source = path.resolve(root, file);
  if (!source.startsWith(root + path.sep) || /\.(mp4|webm|avi|mov)$/i.test(file)) {
    throw new Error(`Arquivo n√£o permitido: ${file}`);
  }
  const target = path.join(root, 'dist', file);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(source, target);
  total += (await stat(source)).size;
}
console.log(`${files.size} arquivos; ${(total / 1e6).toFixed(2)} MB; nenhum v√≠deo inclu√≠do.`);
