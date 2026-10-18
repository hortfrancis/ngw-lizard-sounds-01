// Read prompts/*.txt. Each file is:
//
//   name: Swamp Gargle      <- optional settings, one per line
//   duration: 8
//   ---
//   The prompt text, over as many lines as you like.
//
// Lines starting with # are comments. Files starting with _ are ignored (drafts),
// and so is prompts/archive/.
import { readFile, readdir } from 'node:fs/promises';

const dir = new URL('../prompts/', import.meta.url);

export async function loadPrompts() {
  const files = (await readdir(dir)).filter((f) => f.endsWith('.txt') && !f.startsWith('_')).sort();
  return Promise.all(files.map(async (file) => {
    const lines = (await readFile(new URL(file, dir), 'utf8')).split(/\r?\n/).filter((l) => !l.trim().startsWith('#'));
    const sep = lines.findIndex((l) => l.trim() === '---');
    const settings = Object.fromEntries(
      (sep < 0 ? [] : lines.slice(0, sep))
        .map((l) => l.match(/^\s*(\w+)\s*:\s*(.*?)\s*$/))
        .filter(Boolean)
        .map(([, k, v]) => [k.toLowerCase(), v]),
    );
    const id = file.slice(0, -4);
    return {
      id,
      name: settings.name || id,
      duration: settings.duration ? Number(settings.duration) : null,
      influence: settings.influence ? Number(settings.influence) : 0.3,
      loop: settings.loop !== 'false',
      text: lines.slice(sep + 1).join(' ').replace(/\s+/g, ' ').trim(),
    };
  }));
}
