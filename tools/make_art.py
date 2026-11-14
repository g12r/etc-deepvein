#!/usr/bin/env python3
"""Turn the painted source images in art/source/ into the game-ready pieces in art/.

    python3 tools/make_art.py

Each source is a painting on a plain bright green background. This keys the green out, splits
sheets that hold more than one object, cuts one repeatable section out of the ladder, and saves
small WebP files. build.py then embeds everything in art/ into the game page.
"""
import os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art', 'source')
OUT = os.path.join(ROOT, 'art')


def key(path):
    """Green screen to transparency, with the green fringe pulled off the edges."""
    a = np.asarray(Image.open(os.path.join(SRC, path)).convert('RGB')).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    other = np.maximum(r, b)
    k = np.clip((g - other - 30) / 70.0, 0, 1)
    g2 = np.where(g > other, other + (g - other) * (1 - k) * 0.3, g)
    return Image.fromarray(np.dstack([r, g2, b, 255 * (1 - k)]).astype('uint8'), 'RGBA')


def trim(im):
    return im.crop(im.getbbox())


def split_columns(im, n):
    """Cut a sheet into its n objects at the widest empty gaps between them."""
    alpha = np.asarray(im)[..., 3]
    filled = (alpha > 40).sum(axis=0) > 2
    runs, start = [], None
    for x, f in enumerate(filled):
        if f and start is None:
            start = x
        if not f and start is not None:
            runs.append([start, x]); start = None
    if start is not None:
        runs.append([start, len(filled)])
    while len(runs) > n:  # merge the two runs with the smallest gap between them
        gaps = [runs[i + 1][0] - runs[i][1] for i in range(len(runs) - 1)]
        i = gaps.index(min(gaps)); runs[i][1] = runs[i + 1][1]; del runs[i + 1]
    assert len(runs) == n, (len(runs), n)
    return [trim(im.crop((a, 0, b, im.size[1]))) for a, b in runs]


def save(im, name, width=None, height=None):
    if width:
        im = im.resize((width, max(1, round(im.size[1] * width / im.size[0]))), Image.LANCZOS)
    if height:
        im = im.resize((max(1, round(im.size[0] * height / im.size[1])), height), Image.LANCZOS)
    im.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=90, method=6)
    print('%-10s %4d x %-4d %6d bytes' % (name, im.size[0], im.size[1], os.path.getsize(os.path.join(OUT, name + '.webp'))))


save(trim(key('store.png')), 'store', width=640)
save(trim(key('exchange.png')), 'exchange', width=640)
save(trim(key('bunkhouse.png')), 'bunkhouse', width=560)

tower, wheel = split_columns(key('windmill.png'), 2)
save(tower, 'windtower', height=520)
side = max(wheel.size)  # centre the wheel in a square so it can spin about its hub
sq = Image.new('RGBA', (side, side), (0, 0, 0, 0)); sq.paste(wheel, ((side - wheel.size[0]) // 2, (side - wheel.size[1]) // 2))
save(sq, 'windwheel', width=320)

water, frame, board = split_columns(key('props.png'), 3)
save(water, 'watertower', height=460)
save(frame, 'headframe', height=560)
save(board, 'board', width=300)

# Ladder: find how far apart the rungs are, then cut a section holding a whole number of them,
# from the middle of one gap to the middle of another, so the section repeats cleanly up a shaft.
lad = key('ladder.png')
bbox = lad.getbbox(); lad = lad.crop((bbox[0], 0, bbox[2], lad.size[1]))
al = np.asarray(lad)[..., 3].astype(float) / 255
w = lad.size[0]
prof = al[:, int(w * .35):int(w * .65)].mean(axis=1)          # rungs show as peaks down the middle
p = prof - prof.mean()
ac = np.correlate(p, p, 'full')[len(p) - 1:]
lo = 20
period = lo + int(np.argmax(ac[lo:len(p) // 3]))
mid = len(prof) // 2
window = prof[mid:mid + period]
gap = mid + int(np.argmin(np.convolve(window, np.ones(5) / 5, 'same')))  # the emptiest row: mid-gap
RUNGS = 3
sec = lad.crop((0, gap, w, gap + period * RUNGS))
print('ladder: rungs every %d px; section holds %d' % (period, RUNGS))
save(sec, 'ladder', height=192)


# ---------- rock and tunnel-wall tiles: six of each, any of which can sit next to any other ----------
from PIL import ImageFilter

T = 128          # tile size in the game art
SRC_PER_TILE = 230  # how many pixels of the source painting one tile covers


def flatten(im, keep):
    """Take out the big light-to-dark sweep painted across the texture, so repeats do not show as a pattern."""
    a = np.asarray(im.convert('RGB')).astype(float)
    lum = a.mean(axis=2)
    half = im.size[0] // 2
    pad = np.pad(lum, half, mode='reflect')
    blur = np.asarray(Image.fromarray(pad.astype('uint8')).filter(ImageFilter.GaussianBlur(im.size[0] * .16))).astype(float)
    blur = blur[half:half + im.size[1], half:half + im.size[0]]
    gain = (lum.mean() / np.maximum(blur, 8)) ** (1 - keep)
    return np.clip(a * gain[..., None], 0, 255)


def smooth(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


def wrap_tile(tex, x0, y0, lap=36):
    """A tile whose right edge runs into its own left edge, and bottom into top, by cross-fading an overlap."""
    big = tex[y0:y0 + T + lap, x0:x0 + T + lap].copy()
    w = smooth(np.arange(lap) / (lap - 1))
    big[:, :lap] = big[:, T:T + lap] * (1 - w)[None, :, None] + big[:, :lap] * w[None, :, None]
    big = big[:, :T]
    big[:lap] = big[T:T + lap] * (1 - w)[:, None, None] + big[:lap] * w[:, None, None]
    return big[:T]


def tile_set(quadrant, name, keep, count=6):
    sheet = Image.open(os.path.join(SRC, 'tiles.png')).convert('RGB')
    h = sheet.size[0] // 2
    q = sheet.crop(((quadrant % 2) * h, (quadrant // 2) * h, (quadrant % 2 + 1) * h, (quadrant // 2 + 1) * h))
    size = round(h * T / SRC_PER_TILE)
    tex = np.asarray(Image.fromarray(flatten(q, keep).astype('uint8')).resize((size, size), Image.LANCZOS)).astype(float)
    room = size - T - 40
    base = wrap_tile(tex, 0, 0)
    # every tile keeps the base tile's outer ring, so all of them share the same edges
    d = np.minimum.reduce(np.meshgrid(np.minimum(np.arange(T), T - 1 - np.arange(T)), np.minimum(np.arange(T), T - 1 - np.arange(T))))
    inner = smooth((d - 5) / 26.0)[..., None]
    rng = np.random.RandomState(7 + quadrant)
    tiles = [base]
    spots = [(room, 0), (0, room), (room, room), (room // 2, room // 3), (room // 3, room)]
    for k in range(count - 1):
        x0, y0 = spots[k]
        crop = tex[y0:y0 + T, x0:x0 + T]
        if k % 2:
            crop = crop[:, ::-1]
        tiles.append(base * (1 - inner) + crop * inner)
    # how well do edges meet? compare the step across a join with the step between neighbouring pixels inside a tile
    inside = np.mean([np.abs(t[:, 1:] - t[:, :-1]).mean() for t in tiles])
    joins = [np.abs(a[:, -1] - b[:, 0]).mean() for a in tiles for b in tiles] + [np.abs(a[-1] - b[0]).mean() for a in tiles for b in tiles]
    print('%s: step across a join %.1f (worst %.1f) against %.1f inside a tile' % (name, np.mean(joins), np.max(joins), inside))
    for k, t in enumerate(tiles):
        Image.fromarray(np.clip(t, 0, 255).astype('uint8')).save(os.path.join(OUT, '%s%d.webp' % (name, k + 1)), 'WEBP', quality=88, method=6)
    # a contact sheet of the tiles laid at random, for checking by eye
    n = 8
    sheet = np.zeros((T * n, T * n, 3))
    for j in range(n):
        for i in range(n):
            sheet[j * T:(j + 1) * T, i * T:(i + 1) * T] = tiles[rng.randint(count)]
    return Image.fromarray(np.clip(sheet, 0, 255).astype('uint8'))


CHECK = os.path.join(ROOT, 'docs', 'proposals', 'art-test')
tile_set(0, 'rock', keep=.1).save(os.path.join(CHECK, 'seamless-rock-check.jpg'), quality=88)
tile_set(3, 'wall', keep=.05).save(os.path.join(CHECK, 'seamless-wall-check.jpg'), quality=88)
