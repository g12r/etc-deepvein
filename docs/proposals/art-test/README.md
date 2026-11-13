# Art test: painted images in the real game

A test of whether AI-generated painted art can replace the code-drawn graphics. Two images were generated, cut up, and swapped into a copy of the game. The game on `main` is not changed by any of this.

- `generated-tiles.png` — one image holding four tiles: rock, rock with gold, rock with crystals, tunnel back wall
- `generated-store.png` — the General Store on a green background, which is keyed out
- `deepvein-art-test.html` — the game with those images in place. Playable.
- `painted-town.png`, `painted-mine.png`, `painted-deep.png` — screenshots of it
- `art_build.py` — how the images were processed and wired in (paths are from the session it was run in)

## What was swapped

Rock in every layer (one texture, tinted darker and more purple with depth), tunnel back walls, gold, gems, and the General Store. Everything else is still drawn by code: the miner, Pip, the Ore Exchange, the Bunkhouse, ladders, timber, lanterns, copper, silver, rubies, machines, water and the sky.

## What the test showed

- **Buildings work.** The store dropped straight in and looks like the reference picture.
- **Rock works with care.** One painted texture stretched over a 3 × 3 block of tiles reads as chunky boulders. Used one tile at a time it looked like fish scales, and mirrored it looked like a kaleidoscope.
- **Still visible:** a faint square every three tiles where the texture repeats, and a lighter corner left over from the lighting painted into the image.
- **Ore needs its own art.** Cutting gold and crystals out of a rock tile leaves a soft halo. They should be generated on a plain background, as the store was.
- **Mixed styles clash.** Painted rock next to code-drawn silver, a code-drawn miner and code-drawn buildings looks unfinished. Going this way means replacing nearly everything.
