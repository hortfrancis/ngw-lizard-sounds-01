# 🦎 The Deadly Lizard

Looping weird lizard sounds on a phone for the Norwich Ghost Walks Halloween 2026 special.

## Setup (once)

```sh
npm install
npm run set-key          # paste your ElevenLabs API key; dotenvx encrypts it into .env
npm run generate         # creates sounds/*.mp3 from prompts/*.txt
```

- `.env` holds the **encrypted** key. `.env.keys` holds the private decryption key. Never share or commit `.env.keys`.
- Prompts live in `prompts/` as one text file per sound (see `prompts/README.md`).
- You can also drop your own `.mp3`/`.wav` files into `sounds/`.

## Each night

1. On the phone, open **https://ngw-lizard-sounds.alex-hortfrancis.workers.dev**. Add it to your Home Screen if you like.
2. Wait for "8 sounds loaded", then switch to Airplane mode.
3. Tap **PLAY**.

Once it's loaded, the page is saved for offline use, so it still works if the tab reloads in Airplane mode. Still open it once online before each show, so it's fresh.

## Deploying changes

```sh
npm run deploy   # rebuilds dist/ and deploys it to Cloudflare Workers with Wrangler (needs `npx wrangler login`)
```

You can still test locally over Wi-Fi with `npm start`. It serves on `http://<laptop-ip>:8080`, but without offline-after-reload, because that needs HTTPS.

## Controls

There's one big **PLAY / STOP** button.

Play starts an endless, non-repeating mix of every clip in `sounds/`. Two voices each play clip after clip, and each new clip overlaps the end of the last one. Every clip gets a random pitch, volume and stereo position, with slow pitch drift and crossfades. Clips that are already playing or were used recently are skipped.

To tune the mix, edit the `MIX` constants at the top of the script in `src/index.html`, then run `npm start`.

## Organising sounds

- Every `prompts/*.txt` and `sounds/*.mp3` is part of the mix.
- To take a sound out of the mix, move it into `prompts/archive/` and `sounds/archive/`.
- To add one, write a new prompt, then run `npm run generate` and `npm start`.

## Phone gotchas

- **Keep the screen on.** The page asks the phone to stay awake while it plays. To be safe, also set Auto-Lock to Never for the night, because most phones stop web audio when the screen locks.
- **iPhone silent switch**: iOS 17+ plays through it. On older iOS, flip the switch to ring.
- Use a Bluetooth speaker for extra menace.
