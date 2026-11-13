# Deepvein

A gold rush mining game for a 10-year-old. You dig shafts, shore up roofs, haul
ore out and sell it, and hunt for the Mother Lode at the bottom of the claim.
Multiplication facts (1 to 10 times tables) are how you earn bonuses along the
way.

## Play

Open `deepvein.html` in a browser. It is a single self-contained page and saves
the claim in that browser. A claim saved by an earlier version carries over.

## Play online

With GitHub Pages turned on for this repository (Settings, Pages, deploy from
the `main` branch, root folder), the game is served at:

- `https://g12r.github.io/etc-deepvein/` — start page
- `https://g12r.github.io/etc-deepvein/deepvein.html` — the newest version
- `https://g12r.github.io/etc-deepvein/releases/deepvein-2.0.html`
- `https://g12r.github.io/etc-deepvein/releases/deepvein-1.0.html`

`releases/` keeps a fixed copy of each version so its link never changes.

## Versions

The git history is the version history: one commit per release of the game.

- Deepvein 1.0
- Deepvein 2.0

To play an older version, check out its commit and open `deepvein.html`.

## Build

`deepvein.html` is built from the pieces in `src/`:

    python3 build.py

- `src/head.html` — page markup and styles
- `src/helpers.js` — colour and sound helpers
- `src/tiles.js` — tile and ore art
- `src/game.js` — the game

## Tests

Scripted playtests that drive the built page in a headless browser. They need
Node and Playwright with Chromium.

    cd tests
    node systems.js

Each script prints what it checked and any page errors. `tests/fixtures/` holds
older builds of the game, used to make saved claims for the carry-over tests.
