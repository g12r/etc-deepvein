# Deepvein

A gold rush mining game for a 10-year-old. You dig shafts, shore up roofs, haul
ore out and sell it. Multiplication facts (1 to 10 times tables) are how you
earn bonuses along the way.

## Play

Open `deepvein.html` in a browser. It is a single self-contained page and saves
the claim in that browser.

## Versions

The git history is the version history: one commit per release of the game.

- Deepvein 1.0

## Build

`deepvein.html` is built from the pieces in `src/`:

    python3 build.py

- `src/head.html` — page markup and styles
- `src/helpers.js` — tile art and sound helpers
- `src/game.js` — the game
