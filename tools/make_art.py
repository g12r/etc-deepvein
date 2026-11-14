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
