# Lizard prompts

There is one `.txt` file per sound. Edit them freely and commit them.

**Premise:** *A weird old lizard monster, gargling, in a swampy way…*

## Workflow

```sh
npm run generate                  # generate any prompts that don't have an mp3 yet
npm run generate -- swamp-gargle  # regenerate one sound after editing its prompt
npm run generate -- --force       # regenerate everything (this costs credits)
npm start                         # rebuild the app and serve it to your phone
```

- Copy `_template.txt` to start a new sound.
- Files starting with `_` are ignored, and so is `archive/`. Move a prompt and its mp3 into `prompts/archive/` and `sounds/archive/` to take it out of the mix.
- Results vary every time. If a take is wrong, run it again before rewriting the prompt.

## ElevenLabs prompting tips

From the [Sound Effects docs](https://elevenlabs.io/docs/overview/capabilities/sound-effects) and the [API reference](https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert):

- **Keep it clear and concise.** Describe the sound and its source plainly, e.g. "Glass shattering on concrete".
- **Describe the order for multi-part sounds.** For example: "coughing up swamp water, then a long wet hiss".
- **Use audio terms.** *ambience, loop, drone, one-shot, impact, whoosh, glitch, braam, stem* help steer the result. For close, intimate creature noises, "close-up" works well.
- **`influence` (prompt_influence, 0–1, default 0.3).** Higher follows the prompt literally with less variation. Lower is more creative, which can be good for weird.
- **`duration` (0.5–30 s).** If you leave it out, the model picks a length. A set duration costs about 40 credits per second.
- **`loop: true`** makes the sound repeat seamlessly. It only works with the `eleven_text_to_sound_v2` model, which is what the generator uses.

## What works for this lizard

- Name the **creature** (old lizard monster, ancient reptile).
- Name the **mouth noise** (gargling, gurgling, croaking, wheezing, hissing).
- Name the **wet texture** (bubbling, phlegmy, gloopy, squelching, mucus rattle).
- Name the **place** (swamp, bog, marsh at night).
- The favourites so far are `bog-breath`, `mid-creak` and `throat-croak`: slow, wet, creaky throat and breath sounds, close-up, in an eerie swamp. The 30 s clips are written in that style.
- Keep loops to one continuous texture. A loop that "builds to a roar" will jump when it restarts.
- The app's pitch slider and Wobble change the character a lot, so "deep" and "slow" prompts give you more room to pitch up.
