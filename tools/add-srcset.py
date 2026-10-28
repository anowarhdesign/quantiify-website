import re, glob, os
from pathlib import Path
from PIL import Image
made = []
for f in glob.glob('assets/ui/*.webp') + glob.glob('assets/cad/*.webp') + ['assets/product/app-symbol-count-ui.webp']:
    f = Path(f).as_posix()
    if f.endswith('-900.webp'):
        continue
    im = Image.open(f)
    if im.width <= 1000:
        continue
    t = im.convert('RGB').resize((900, round(im.height * 900 / im.width)), Image.LANCZOS)
    t.save(f[:-5] + '-900.webp', 'WEBP', quality=84, method=6)
    made.append(f)
print('variants', len(made))

def rep(m):
    tag, src = m.group(0), m.group(2)
    if 'srcset=' in tag or 'id="trade' in tag:   # trade tab images are swapped by script via src
        return tag
    base = src.split('?')[0].replace('assets/ui/../product/', 'assets/product/')
    if base not in made:
        return tag
    w = re.search(r'width="(\d+)"', tag)
    return tag.replace(f'src="{src}"', f'src="{src}" srcset="{src[:-5]}-900.webp 900w, {src} {w.group(1) if w else 1800}w" sizes="(max-width: 720px) 100vw, 1100px"')

h = open('index.html', encoding='utf-8').read()
h = re.sub(r'<img ([^>]*?)src="([^"]+\.webp)"[^>]*>', rep, h)
h = re.sub(r'(<img class="ba-(?:after|before)" id="trade(?:Img|Draw)" [^>]*?)(alt="")',
           lambda m: m.group(0) if 'loading=' in m.group(0) else m.group(1) + 'loading="lazy" decoding="async" ' + m.group(2), h)
open('index.html', 'w', encoding='utf-8').write(h)
print('srcset', h.count('srcset='), 'lazy trade', len(re.findall(r'id="trade(?:Img|Draw)"[^>]*loading="lazy"', h)))
c = open('styles.css', encoding='utf-8').read()
if '/* contrast */' not in c:
    c += '\n/* contrast */\n.eyebrow{color:var(--slate)}\n.ref{color:#1559c0}\n'
open('styles.css', 'w', encoding='utf-8').write(c)
