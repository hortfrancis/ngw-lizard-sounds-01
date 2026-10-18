// Bundle every sound in sounds/ (not sounds/archive/) into one self-contained dist/index.html (audio inlined as base64),
// so a single page load is all the phone needs before going into Airplane mode.
import { readFile, writeFile, readdir, mkdir, copyFile } from 'node:fs/promises';
import { loadPrompts } from './prompts.mjs';

const root = new URL('../', import.meta.url);
const soundsDir = new URL('sounds/', root);
const distDir = new URL('dist/', root);

const prompts = await loadPrompts();
const files = (await readdir(soundsDir)).filter((f) => /\.(mp3|wav|ogg|m4a)$/i.test(f));

// Sounds from prompts/ first (in that order), then any extra files you dropped in.
const ordered = [
  ...prompts
    .filter((p) => files.some((f) => f.startsWith(p.id + '.')))
    .map((p) => ({ id: p.id, name: p.name })),
  ...files
    .filter((f) => !prompts.some((p) => f.startsWith(p.id + '.')))
    .map((f) => ({ id: f.replace(/\.[^.]+$/, ''), name: f.replace(/\.[^.]+$/, '') })),
];

const mime = { mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', m4a: 'audio/mp4' };
const sounds = [];
for (const s of ordered) {
  const file = files.find((f) => f.startsWith(s.id + '.'));
  const ext = file.split('.').pop().toLowerCase();
  const data = (await readFile(new URL(file, soundsDir))).toString('base64');
  sounds.push({ ...s, src: `data:${mime[ext]};base64,${data}` });
}

const html = (await readFile(new URL('src/index.html', root), 'utf8'))
  .replace('/*__SOUNDS__*/[]', () => JSON.stringify(sounds));

await mkdir(distDir, { recursive: true });
await writeFile(new URL('index.html', distDir), html);
await copyFile(new URL('src/sw.js', root), new URL('sw.js', distDir));

const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log(`Built dist/index.html with ${sounds.length} sound(s), ${kb} KB.`);
if (!sounds.length) console.log('No sounds found in sounds/. Run `npm run generate` first.');
