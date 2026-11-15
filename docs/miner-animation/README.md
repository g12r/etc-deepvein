# Miner animation brief

This is a brief for an artist (human or model) making better animation art for the miner in Deepvein, a 2D side-view gold rush mining game that runs in a web browser.

## What is in this folder

| File | What it is |
| --- | --- |
| `miner-side-poses.png` | The current sheet for the side view: standing, three pick-swing poses, four walk poses. |
| `miner-climb.png` | The current sheet for climbing a ladder, seen from behind. |
| `in-game-reference.png` | A screenshot of the game, to show the painted style and how small the miner is on screen. |

The current art is the character and style to keep. What needs to improve is the animation: more poses, smoother motion between them, and every pose drawn as the same miner.

## The character

A sturdy cartoon gold rush miner, about three and a half heads tall.

- Brown wide-brim hat with a brass headlamp on the front
- Full brown beard, red bandana around the neck
- Blue shirt with rolled sleeves, brown suspenders, brown trousers, chunky brown lace-up boots
- Olive green canvas backpack
- A short pickaxe with a wooden handle and a dark steel head

Style: hand-painted cartoon, warm colours, soft shading, a dark outline, lit from the upper left. He must look like he belongs in `in-game-reference.png`.

## What is wrong with the current animation

- **Walk:** only three truly different leg positions (the fourth nearly repeats the first), and the same leg always leads. It reads as a shuffle.
- **Pick swing:** three poses with big jumps between them, and his feet change position from pose to pose.
- **Standing:** a single still pose.
- **Climb:** two real poses. The "other arm" pose is the first one mirrored, which flips the pickaxe on his back.

## The animations wanted

Side view, facing right. The game mirrors the art when he faces left, so draw right-facing only.

| Animation | Frames | What it should show |
| --- | --- | --- |
| Stand | 2 to 4 | Feet together, pickaxe held low at his side. A slow breathing loop. |
| Walk | 8 | A full loop: contact, down, passing, up for the right leg, then the same four for the left leg. Wide strides, the free arm swinging opposite the legs, a slight bob. Pickaxe carried low in the rear hand. Frame 8 must flow back into frame 1. |
| Pick swing | 4 to 6 | Wind up with the pickaxe high over his head, swing down, strike with the head of the pick low in front of him, then recover. Feet stay planted in the same place in every frame. |
| Jump or fall | 1 or 2 | In the air, legs tucked or trailing. Optional, but the game has no pose for this today. |

Back view, climbing a ladder. Do not draw the ladder.

| Animation | Frames | What it should show |
| --- | --- | --- |
| Climb | 4 | Right hand reaching high with the left knee up; pulled up with both hands level; left hand reaching high with the right knee up; pulled up again. Draw the left and right reaches separately. The pickaxe strapped across his backpack must point the same way in all four. |

If you can only do part of this, the walk matters most, then the pick swing.

## Rules the sheets must follow

The game cuts each sheet into frames automatically, so these matter as much as the drawing.

1. **One miner.** Every frame must be the same character at the same size and proportions. The most reliable way is to draw all the side-view poses in a single image.
2. **A plain grid.** Lay the frames out in equal cells, in rows and columns, in reading order (left to right, top row first). One animation per row is ideal.
3. **Stay inside the cell.** Each pose, including the whole pickaxe at its highest and furthest point, must sit fully inside its own cell with clear empty space on every side. Nothing may touch or cross into a neighbouring cell.
4. **A shared ground line.** Within a row, his feet stand on the same horizontal line in every frame, and the image scale is identical. Do not centre each pose vertically on its own.
5. **Stay in place.** Draw him walking on the spot. Do not move him across the cell from frame to frame; the game moves him.
6. **Background.** Either a transparent PNG, or a flat pure green `#00FF00` with nothing else on it. No gradients, no texture, no grid lines, no labels or numbers.
7. **No ground shadow.** No shadow or dust under his feet. The game draws its own.
8. **No bright green on him.** If you use the green background, keep saturated greens off the character. The olive backpack is fine.
9. **Size.** PNG, with the standing miner at least 300 pixels tall. Bigger is fine.
10. **Nothing extra.** No props, scenery, text, borders or signatures.

## How the game plays the frames

This helps in judging how each animation should read.

- He is small on screen: roughly 60 to 130 pixels tall, depending on the window. Silhouettes and leg positions need to be clear at that size. Fine detail is lost.
- Walk: about 10 frames a second at full speed, slower as he slows.
- Pick swing: the strike pose flashes for about a tenth of a second on each hit, then he lifts the pick for the next one. He swings several times a second while digging.
- Climb: the pose advances as he moves up or down the ladder, roughly one pose every third of a block.
- Poses are lined up on his chest and feet, so keep his body in the same spot of the cell from frame to frame.

## What to send back

- One PNG for the side view and one PNG for the climb (or one per animation).
- For each sheet: how many columns and rows it has, and which animation is in which row.
