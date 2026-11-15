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


# ---------- rock and tunnel-wall tiles: sixteen of each, laid so that neighbours always match ----------
# Each of a tile's four edges comes in two versions. A tile is named by which version it has on its
# top, right, bottom and left, which gives 16 tiles. The game gives every edge in the world a random
# version and picks the tile that fits, so no ring of pixels is shared by every tile and the eye has
# far less to lock on to. Only a small patch at each corner is the same everywhere.
from PIL import ImageFilter

T = 128             # tile size in the game art
SRC_PER_TILE = 230  # how many pixels of the source painting one tile covers
EDGE = 26           # how far in from an edge its shared strip reaches
CORNER = 26         # along an edge, how far from a corner the shared corner patch holds


def flatten(im, keep):
    """Take out any big light-to-dark sweep painted across the texture, so repeats do not show as a pattern."""
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


def tile_set(source, name, keep, seed):
    q = Image.open(os.path.join(SRC, source)).convert('RGB')
    size = round(q.size[0] * T / SRC_PER_TILE)
    tex = np.asarray(Image.fromarray(flatten(q, keep).astype('uint8')).resize((size, size), Image.LANCZOS)).astype(float)
    rng = np.random.RandomState(seed)
    room = size - T

    def patch():
        x0, y0 = rng.randint(0, room + 1), rng.randint(0, room + 1)
        return tex[y0:y0 + T, x0:x0 + T]

    half = T // 2
    # the corner patch and the edge strips are painted around the middle of a crop, then shifted by half
    # a tile, so the crop's own unbroken middle is what lands on the tile's corner or edge
    corner = np.roll(patch(), (half, half), axis=(0, 1))
    horiz = [np.roll(patch(), half, axis=0) for _ in range(2)]   # for top and bottom edges
    vert = [np.roll(patch(), half, axis=1) for _ in range(2)]    # for left and right edges
    yy, xx = np.mgrid[0:T, 0:T]
    along_x = np.minimum(xx, T - 1 - xx)
    along_y = np.minimum(yy, T - 1 - yy)
    to_corner_x = (1 - smooth((along_x - CORNER) / 20.0))[..., None]
    to_corner_y = (1 - smooth((along_y - CORNER) / 20.0))[..., None]
    horiz = [h * (1 - to_corner_x) + corner * to_corner_x for h in horiz]
    vert = [v * (1 - to_corner_y) + corner * to_corner_y for v in vert]
    near = lambda d: smooth(1 - d / float(EDGE))[..., None]
    # interiors come from a grid of crops that do not overlap one another
    per = (size - 4) // T
    stride = room // (per - 1)
    cells = [(i * stride, j * stride) for j in range(per) for i in range(per)]
    rng.shuffle(cells)
    tiles = {}
    for k in range(16):
        n, e, s, w = k & 1, (k >> 1) & 1, (k >> 2) & 1, (k >> 3) & 1
        x0, y0 = cells[k % len(cells)]
        out = tex[y0:y0 + T, x0:x0 + T].copy()
        for layer, d in ((horiz[n], yy), (horiz[s], T - 1 - yy), (vert[w], xx), (vert[e], T - 1 - xx)):
            wgt = near(d)
            out = out * (1 - wgt) + layer * wgt
        tiles[k] = out
    # measure every legal join against the ordinary step between neighbouring pixels inside a tile
    inside = np.mean([np.abs(t[:, 1:] - t[:, :-1]).mean() for t in tiles.values()])
    joins = []
    for a in range(16):
        for b in range(16):
            if (a >> 1) & 1 == (b >> 3) & 1:
                joins.append(np.abs(tiles[a][:, -1] - tiles[b][:, 0]).mean())   # a's right edge against b's left
            if (a >> 2) & 1 == b & 1:
                joins.append(np.abs(tiles[a][-1] - tiles[b][0]).mean())         # a's bottom against b's top
    print('%s: 16 tiles; step across a join %.1f (worst %.1f) against %.1f inside a tile; %d interior crops that do not overlap'
          % (name, np.mean(joins), np.max(joins), inside, len(cells)))
    for k, t in tiles.items():
        Image.fromarray(np.clip(t, 0, 255).astype('uint8')).save(os.path.join(OUT, '%s%d.webp' % (name, k)), 'WEBP', quality=88, method=6)
    # a check image: tiles laid the way the game lays them, with random edge versions
    cols = 10
    hb = rng.randint(0, 2, (cols + 1, cols))
    vb = rng.randint(0, 2, (cols, cols + 1))
    sheet = np.zeros((T * cols, T * cols, 3))
    for j in range(cols):
        for i in range(cols):
            k = hb[j, i] | (vb[j, i + 1] << 1) | (hb[j + 1, i] << 2) | (vb[j, i] << 3)
            sheet[j * T:(j + 1) * T, i * T:(i + 1) * T] = tiles[k]
    return Image.fromarray(np.clip(sheet, 0, 255).astype('uint8'))


CHECK = os.path.join(ROOT, 'docs', 'proposals', 'art-test')
tile_set('rock.png', 'rock', keep=.35, seed=11).save(os.path.join(CHECK, 'seamless-rock-check.jpg'), quality=88)
tile_set('wall.png', 'wall', keep=.3, seed=23).save(os.path.join(CHECK, 'seamless-wall-check.jpg'), quality=88)


# ---------- the miner and Pip: pose sheets cut into animation frames, packed into one atlas ----------
import json


def frames_from(sheet_name, cols, rows, row_edges=None):
    im = key(sheet_name)
    cw, ch = im.size[0] // cols, im.size[1] // rows
    edges = row_edges or [r * ch for r in range(rows)] + [im.size[1]]   # where one row of the sheet ends and the next begins
    out = []
    for r in range(rows):
        for c in range(cols):
            cell = im.crop((c * cw, edges[r], (c + 1) * cw, edges[r + 1]))
            a = np.asarray(cell)[..., 3]
            a = np.where(a > 60, a, 0)                      # drop faint specks before measuring
            ys, xs = np.where(a > 0)
            box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
            out.append(cell.crop(box))
    return out


def foot_x(fr, part=.14):
    """Where the feet are, left to right: the anchor that keeps a character from sliding between frames."""
    a = np.asarray(fr)[..., 3]
    band = a[int(a.shape[0] * (1 - part)):]
    xs = np.where(band > 60)[1]
    return float(xs.mean())


miner = frames_from('miner.png', 5, 2)
rat = frames_from('rat.png', 4, 2)
MS = 200.0 / miner[0].size[1]      # the standing miner is stored 200 px tall
RS = 190.0 / max(f.size[0] for f in rat)
names = ['idle', 'walk1', 'walk2', 'walk3', 'walk4', 'swing1', 'swing2', 'swing3', 'climb1', 'climb2']
items = []
for n, fr in zip(names, miner):
    ax = fr.size[0] / 2 if n.startswith('climb') else foot_x(fr)
    items.append(('m_' + n, fr, MS, ax))
for k, fr in enumerate(rat):
    items.append((('r_full%d' if k < 4 else 'r_empty%d') % (k % 4 + 1), fr, RS, fr.size[0] / 2))
# ---- quartz veins and cracks, the machines, timber, belt and rail: more frames for the same atlas ----
def add(name, fr, width=None, height=None, ax=None):
    sc = (width / float(fr.size[0])) if width else (height / float(fr.size[1]))
    items.append((name, fr, sc, fr.size[0] / 2.0 if ax is None else ax))


decals = frames_from('decals.png', 3, 2)
for n, fr in zip(['vein1', 'vein2', 'vein3'], decals[:3]):
    add(n, fr, width=150)
for n, fr in zip(['crack1', 'crack2', 'crack3'], decals[3:]):
    add(n, fr, width=[70, 120, 140][int(n[-1]) - 1])

mach = frames_from('machines.png', 3, 2)
add('pump', mach[0], height=210)
add('drill', mach[1], width=180)
add('cart', mach[2], width=140)
add('cage', mach[3], height=270)
add('bucket', mach[4], width=120)
add('lantern', mach[5], height=120)

parts = frames_from('timber.png', 2, 2, row_edges=[0, 640, 1024])   # the posts are taller than half the sheet
for tag, fr in (('post', parts[0]), ('tall', parts[1])):
    a = np.asarray(fr)[..., 3] > 60
    widths = a.sum(axis=1)
    post_w = np.median(widths[int(len(widths) * .6):int(len(widths) * .9)])
    cap_end = max(y for y in range(len(widths) // 2) if widths[y] > post_w * 1.25) + 2   # last row of the braces
    beam_end = max(y for y in range(cap_end) if widths[y] > widths.max() * .93) + 1       # last row of the beam itself
    cols = np.where(a[int(len(widths) * .6):int(len(widths) * .9)].any(axis=0))[0]
    body = fr.crop((cols.min(), cap_end + 6, cols.max() + 1, int(fr.size[1] * .8)))       # the post, without its ragged foot
    W = 250 if tag == 'post' else 280
    sc = W / float(fr.size[0])
    items.append((tag + '_cap', fr.crop((0, 0, fr.size[0], cap_end)), sc, fr.size[0] / 2.0))
    items.append((tag + '_body', body, sc, body.size[0] / 2.0))
    if tag == 'post':
        items.append(('beam', fr.crop((0, 0, fr.size[0], beam_end)), sc, fr.size[0] / 2.0))
    print('%s: post is %.0f%% of the cap width; cap and braces take the top %.0f%%' % (tag, 100.0 * body.size[0] / fr.size[0], 100.0 * cap_end / fr.size[1]))

belt = parts[2]
add('belt', belt.crop((int(belt.size[0] * .3), 0, int(belt.size[0] * .7), belt.size[1])), width=128)
rail = parts[3]
ra = (np.asarray(rail)[..., 3] > 60)
ties = ra[int(rail.size[1] * .7):].mean(axis=0)                 # the cross ties show as bumps along the bottom
tp = ties - ties.mean()
tac = np.correlate(tp, tp, 'full')[len(tp) - 1:]
tper = 30 + int(np.argmax(tac[30:len(tp) // 3]))
start = len(ties) // 4
start += int(np.argmin(np.convolve(ties[start:start + tper], np.ones(5) / 5, 'same')))
add('rail', rail.crop((start, 0, start + tper * 3, rail.size[1])), width=128)
print('rail: ties every %d px; the section holds 3' % tper)

# pack in rows
meta, x, y, rowh, W = {}, 0, 0, 0, 1024
placed = []
for n, fr, sc, ax in items:
    small = fr.resize((max(1, round(fr.size[0] * sc)), max(1, round(fr.size[1] * sc))), Image.LANCZOS)
    if x + small.size[0] + 2 > W:
        x, y, rowh = 0, y + rowh + 2, 0
    placed.append((small, x, y))
    meta[n] = {'x': x, 'y': y, 'w': small.size[0], 'h': small.size[1], 'ax': round(ax * sc, 1)}
    x += small.size[0] + 2
    rowh = max(rowh, small.size[1])
atlas = Image.new('RGBA', (W, y + rowh), (0, 0, 0, 0))
for small, px, py in placed:
    atlas.paste(small, (px, py))
atlas.save(os.path.join(OUT, 'sprites.webp'), 'WEBP', quality=92, method=6)
meta['_minerHeight'] = round(miner[0].size[1] * MS)
with open(os.path.join(OUT, 'sprites.json'), 'w') as f:
    json.dump(meta, f, separators=(',', ':'))
print('sprites    %4d x %-4d %6d bytes, %d frames' % (atlas.size[0], atlas.size[1], os.path.getsize(os.path.join(OUT, 'sprites.webp')), len(items)))
