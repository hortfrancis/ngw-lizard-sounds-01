// Generate lizard sounds with the ElevenLabs Sound Effects API.
// Run via `npm run generate` so dotenvx decrypts ELEVENLABS_API_KEY from .env.
//
//   npm run generate              -> generate any sounds not already in sounds/
//   npm run generate -- --force   -> regenerate everything
//   npm run generate -- hiss-low  -> (re)generate only the given ids
import { writeFile, mkdir, access } from 'node:fs/promises';
import { loadPrompts } from './prompts.mjs';

const root = new URL('../', import.meta.url);
const soundsDir = new URL('sounds/', root);
const key = process.env.ELEVENLABS_API_KEY;

if (!key) {
  console.error('ELEVENLABS_API_KEY is not set. Run `npm run set-key` first.');
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

const prompts = await loadPrompts();
await mkdir(soundsDir, { recursive: true });

const exists = (url) => access(url).then(() => true, () => false);

for (const p of prompts) {
  if (only.length && !only.includes(p.id)) continue;
  const out = new URL(`${p.id}.mp3`, soundsDir);
  if (!force && !only.length && (await exists(out))) {
    console.log(`skip  ${p.id} (exists)`);
    continue;
  }

  process.stdout.write(`gen   ${p.id} ... `);
  const res = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({
      text: p.text,
      duration_seconds: p.duration,
      prompt_influence: p.influence,
      loop: p.loop,
      model_id: 'eleven_text_to_sound_v2',
    }),
  });

  if (!res.ok) {
    console.log('FAILED');
    console.error(`  ${res.status} ${res.statusText}: ${await res.text()}`);
    continue;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(out, buf);
  console.log(`ok (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log('\nDone. Now run `npm start` to build and serve the app.');
