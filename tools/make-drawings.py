"""Make CAD-style line drawings (the "before" side of the sliders) from photos.

Run from the site root:  python tools/make-drawings.py
Each assets/product/trade-*.webp gets a matching *-drawing.webp.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PAPER = np.array([251, 253, 255], float)
INK = np.array([26, 107, 214], float)
GRID = [226, 234, 246]


def drawing(src, dst):
    gray = Image.open(src).convert('L').filter(ImageFilter.GaussianBlur(1.1))
    edges = np.asarray(gray.filter(ImageFilter.FIND_EDGES)).astype(float)
    ink = np.clip((edges - 6) * 5.5, 0, 255)[..., None] / 255.0
    out = PAPER * (1 - ink) + INK * ink
    h, w = edges.shape
    yy, xx = np.mgrid[0:h, 0:w]
    grid = ((xx % 40 == 0) | (yy % 40 == 0)) & (ink[..., 0] < .15)
    out[grid] = GRID
    Image.fromarray(out.astype('uint8')).save(dst, 'WEBP', quality=84, method=6)


for src in sorted((ROOT / 'assets/product').glob('trade-*.webp')):
    if src.stem.endswith('-drawing'):
        continue
    dst = src.with_name(src.stem + '-drawing.webp')
    drawing(src, dst)
    print('wrote', dst.relative_to(ROOT))
