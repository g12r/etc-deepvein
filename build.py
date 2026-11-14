#!/usr/bin/env python3
"""Join the pieces in src/ into the single playable page, deepvein.html.

    python3 build.py

The page is written with no raw non-ASCII characters, so symbols such as the
multiplication sign display correctly however the browser reads the file.
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))


def read(name):
    with open(os.path.join(ROOT, 'src', name), encoding='utf-8') as f:
        return f.read()


head = read('head.html')
# helpers.js opens the <script> tag and game.js closes it
js = read('helpers.js')
if os.path.exists(os.path.join(ROOT, 'src', 'tiles.js')):
    js += read('tiles.js')
# painted images in art/ are embedded in the page so it stays one self-contained file
import base64, glob
art = {}
for path in sorted(glob.glob(os.path.join(ROOT, 'art', '*.webp'))):
    with open(path, 'rb') as f:
        art[os.path.splitext(os.path.basename(path))[0]] = 'data:image/webp;base64,' + base64.b64encode(f.read()).decode()
js += 'const ART={' + ','.join('%s:"%s"' % kv for kv in art.items()) + '};\n'
js += read('game.js')

js = re.sub(r'[^\x00-\x7f]', lambda m: '\\u%04x' % ord(m.group(0)), js)
head = re.sub(r'[^\x00-\x7f]', lambda m: '&#%d;' % ord(m.group(0)), head)

page = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        + head + js)
with open(os.path.join(ROOT, 'deepvein.html'), 'w', encoding='utf-8') as f:
    f.write(page)
print('built deepvein.html', len(page), 'bytes')
