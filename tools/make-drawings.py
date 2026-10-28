"""Make the "CAD drawing" side of the sliders from each takeoff sheet.

Run from the site root:  python tools/make-drawings.py
Each assets/cad/<trade>-takeoff.webp (elements highlighted by layer) gets a
matching <trade>-cad.webp: the same sheet as plain monochrome linework, the way
an estimator receives it. Both halves come from one image, so they line up.
"""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent


def plain(src, dst):
    a = np.asarray(Image.open(src).convert('RGB')).astype(float)
    lum = a @ [0.299, 0.587, 0.114]
    sat = a.max(2) - a.min(2)
    coloured = sat > 40
    # coloured strokes become mid-grey linework, everything else plain greyscale
    out = np.where(coloured, np.minimum(lum, 150) * 0.7 + 40, lum)
    Image.fromarray(np.clip(out, 0, 255).astype('uint8')).convert('RGB') \
        .save(dst, 'WEBP', quality=88, method=6)


for src in sorted((ROOT / 'assets/cad').glob('*-takeoff.webp')):
    dst = src.with_name(src.name.replace('-takeoff', '-cad'))
    plain(src, dst)
    print('wrote', dst.relative_to(ROOT))
