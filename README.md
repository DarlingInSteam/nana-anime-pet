# Nana — anime pet

An animated anime character sprite sheet with 9 animations and 16 gaze directions. Transparent PNG, 1536 × 2288 pixels, 73 frames.

**[Interactive demo](https://darlinginsteam.github.io/nana-anime-pet/)** · **[Download sprite sheet](assets/nana.png)**

## Preview

![Nana animations](previews/animations.gif)

![Nana poses: idle, wave, jump and processing](previews/poses.png)

The demo supports animation selection, pause, size adjustment and cursor-driven gaze. Default size is 100%, matching the 192 × 208 source cell. Enlarging the sprite scales the existing pixels; it does not add detail. The demo size setting does not change the pet size in the desktop app.

## Run locally

No build step or dependencies. From the repository directory:

```sh
python -m http.server 8000
```

Open [localhost:8000](http://localhost:8000).

## Files

| File | Contents |
| --- | --- |
| `assets/nana.png` | Transparent PNG, 1536 × 2288 pixels, 8 × 11 grid, 192 × 208 cells |
| `pet.json` | Animation frame counts, durations and gaze direction order |
| `previews/animations.gif` | All nine animations in one loop |
| `previews/animations.mp4` | Video preview |
| `previews/look-directions.gif` | Gaze direction loop |
| `index.html`, `app.js`, `style.css` | Interactive viewer |

The first nine rows contain 6, 8, 8, 4, 5, 8, 6, 6 and 6 frames. The last two rows contain eight gaze directions each, ordered clockwise from up. Unused cells are transparent. There are 73 populated cells in total.

## Artwork source

The artwork was generated with AI using OpenAI imagegen. The visual reference was [Nana (refined) from LivLiv Player](https://livliv-dev.github.io/player/example/demo.html), with pink hair and a blue hoodie. [LivLiv source project](https://github.com/livliv-dev/player).

This repository contains generated sprites and a viewer. It does not include the `.livliv` model, LivLiv engine or original LivLiv textures.
