"""Generate the How it works product viewer inside index.html.

Run from the site root:  python tools/build-viewer.py
Each step (pane) plays a short sequence of real Quantiify screens from the
Figma dev handoff (frames), each with an animated overlay (.an) showing what
the user does there. Overlay positions are percentages of the screenshot.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CUR = ('<svg class="cur" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.4-6.6L4 20z"/></svg>'
       '<i class="ring"></i>')


def box(cls, x, y, w, h, inner=''):
    return f'<i class="hl {cls}" style="--x:{x}%;--y:{y}%;--w:{w}%;--h:{h}%">{inner}</i>'


def tips(*t):
    return ''.join(f'<span class="tipc t{k}">{s}</span>' for k, s in enumerate(t, 1))


def tip(t):
    return f'<span class="tipc solo">{t}</span>'


# (image, width, height, alt, ms, overlay)
FRAMES = {
    'dashboard': ('dashboard', 1800, 1190, 'Quantiify dashboard with projects', 2600,
                  box('newp', 85.6, 23.8, 9.6, 3.8) + CUR + tip('Start from the dashboard &middot; New project')),
    'setup': ('project-setup', 1800, 1190, 'Create New Project form', 3400,
              '<span class="type">Downtown Office Complex</span>' + box('create', 43.9, 80.6, 30, 3.8) + CUR
              + tip('Name it, pick the trade and units')),
    'uploading': ('uploading', 1800, 1189, 'Uploading drawing documents', 2400,
                  '<b class="upbar"></b>' + tip('Upload PDF and CAD drawing sets')),
    'upload': ('upload', 1800, 1189, 'Files uploaded to the project', 5000,
               box('card', 41.5, 45, 34.8, 9.5, '<b class="bar"></b>') + box('next', 69.4, 73.4, 6.9, 3.7)
               + '<span class="file mono">E-101_lighting.pdf</span>' + CUR
               + tips('Add more sheets any time', 'Every sheet stays organized', 'Next step &rarr; analyze')),
    'detecting': ('analyze', 1800, 1280, 'AI detecting symbols and cable trays', 2600,
                  '<i class="pulse"></i>' + tip('AI reads and classifies every sheet')),
    'takeoff': ('takeoff-cable', 1800, 1280, 'Cable Length Measurement workspace', 6000,
                box('sym', 84.4, 13.2, 6.2, 2.9)
                + ''.join(box(f'det d{k}', x, y, 2.4, 3.2) for k, (x, y) in enumerate(
                    [(44.3, 33), (52.8, 32.1), (49.1, 35.1), (36.8, 43), (52.3, 48.8), (38.9, 52.4)], 1))
                + '<svg class="cable" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="57" y1="47.6" x2="54.8" y2="63.6"/></svg>'
                + '<span class="len mono">L = 14.13 m</span>' + box('commit', 94, 65.4, 4.4, 3.2) + CUR
                + tips('AI auto-detects symbols', 'Click to measure cable runs', 'Review, then commit')),
    'estimate': ('estimate', 1800, 1423, 'Estimation table with priced quantities', 6000,
                 box('row', 19.5, 29.6, 78.8, 3.4) + box('tot t-a', 87.8, 24.8, 6.6, 2.9) + box('tot t-b', 87.8, 53.8, 6.6, 2.9)
                 + box('exp', 92.9, 15.2, 4.4, 3.1) + CUR
                 + tips('Each quantity gets a rate', 'Totals roll up by trade', 'Export the estimate')),
    'export': ('export', 1800, 1423, 'Export Estimation dialog', 6000,
               box('xls', 22, 39, 18.2, 5.6) + box('go', 69, 74.4, 9.2, 3.4)
               + '<span class="toast mono">Estimate_E-101.xlsx &middot; ready</span>' + CUR
               + tips('Pick Excel, CSV or PDF', 'Download a BOQ-ready file')),
}
# How it works shows one still screen per step (the hero tour carries the animation)
PANES = [['upload'], ['SLIDER'], ['takeoff'], ['estimate'], ['export']]
SLIDER_MS = 4400
# On phones each screen zooms into the part that matters (transform-origin, % of the screen)
FOCUS = {'dashboard': (78, 30), 'setup': (58, 42), 'uploading': (58, 34), 'upload': (60, 45), 'detecting': (62, 45),
         'legend': (80, 42), 'symbols': (45, 48), 'takeoff': (72, 40), 'estimate': (68, 40), 'export': (52, 55)}

s = (ROOT / 'index.html').read_text(encoding='utf-8')
a = s.index('<div class="p-photo-frame wf-viewer">')
b = s.index('<p class="wf-cap mono">', a)
viewer = s[a:b]
slider = re.search(r'<div class="ba ba-sheet"[\s\S]*?<span class="ba-tag r mono">AI-detected</span>\s*</div>', viewer).group(0)


def frame(key, anim=True):
    if key == 'SLIDER':
        return f'''            <div class="fr" data-ms="{SLIDER_MS}"><div class="shot" style="--ar:1732/1040">
              {slider}
            </div></div>
'''
    img, w, h, alt, ms, ov = FRAMES[key]
    fx, fy = FOCUS.get(key, (50, 50))
    return f'''            <div class="fr" data-ms="{ms}"><div class="shot" style="--ar:{w}/{h};--fx:{fx}%;--fy:{fy}%"><img src="assets/ui/{img}.webp" width="{w}" height="{h}" loading="lazy" alt="Quantiify: {alt}">
              {f'<div class="an an-{key}" aria-hidden="true" style="--d:{ms / 1000}s">{ov}</div>' if anim else ''}</div></div>
'''


panes = ''.join(f'''          <figure class="wf-pane" data-pane="{i}"{' hidden' if i else ''}>
{''.join(frame(k, anim=False) for k in keys)}            <div class="fr-dots" aria-hidden="true">{''.join('<i></i>' for _ in keys) if len(keys) > 1 else ''}</div>
          </figure>
''' for i, keys in enumerate(PANES))
new_viewer = '<div class="p-photo-frame wf-viewer">\n' + panes + '        </div>\n        '
s = s[:a] + new_viewer + s[b:]

# ---------------------------------------------------------------- hero tour
# The hero plays the whole product flow, one chapter per screen.
OX, OY, SW, SH = 89, 109, 1371, 991     # symbol-count screen: crop offset and size
SYMS = [[550,477],[608,477],[665,477],[884,427],[883,524],[537,535],[646,546],[776,580],[816,580],[873,580],[970,580],
        [560,613],[651,613],[651,641],[762,635],[560,686],[651,686],[762,693],[850,691],[819,720],[840,734],[926,672],[1028,734],
        [560,757],[651,757],[711,759],[762,767],[934,788],[997,655],[831,580],[651,657]]
LEG_ROWS = [34.2, 39.8, 45.4, 51, 56.7, 62.3, 67.9]
LEG_COUNTS = [(20.8, '36'), (24.4, '08'), (28.1, '02'), (31.7, '07'), (35.4, '18'), (39.1, '16')]
FRAMES['legend'] = ('legend', 1800, 1422, 'Legend Overview with AI legend detection', 4200,
    box('auto', 84.6, 8.6, 14.2, 2.8)
    + ''.join(box(f'lrow r{k}', 55.6, y - 2.2, 24.6, 4.4) for k, y in enumerate(LEG_ROWS, 1))
    + ''.join(f'<span class="cnt c{k} mono" style="--y:{y}%">{n}</span>' for k, (y, n) in enumerate(LEG_COUNTS, 1))
    + CUR + tips('AI auto-detects the legend', 'Every legend symbol is matched', 'Counts fill in per legend'))
FRAMES['symbols'] = ('../product/app-symbol-count-ui', SW, SH, 'Symbol counting on the drawing', 4200,
    ''.join(f'<i class="sd" style="--x:{(x - OX) / SW * 100:.2f}%;--y:{(y - OY) / SH * 100:.2f}%;--k:{k}"></i>'
            for k, (x, y) in enumerate(sorted(SYMS)))
    + '<i class="sweep"></i>' + tip('Every symbol found and boxed on the sheet'))
TOUR = [('Project setup', 'setup'), ('Upload', 'uploading'), ('AI legend detection', 'legend'), ('Symbol count', 'symbols'),
        ('Cable takeoff', 'takeoff'), ('Estimate', 'estimate'), ('Export', 'export')]
stage = ''.join(frame(k).replace('<div class="fr"', f'<div class="fr" data-i="{i}"' + (' hidden' if i else ''), 1)
                for i, (_, k) in enumerate(TOUR))
tabs = ''.join(f'<li><button type="button" data-tour="{i}"{" aria-current=\"step\"" if i == 0 else ""}><span>{i + 1:02d}</span>{t}<i class="pb"></i></button></li>'
               for i, (t, _) in enumerate(TOUR))
tour = f'''      <figure class="tour reveal" id="tour" aria-label="Quantiify product tour">
        <div class="tour-frame">
          <div class="tour-stage">
{stage}          </div>
        </div>
        <ol class="tour-tabs mono">{tabs}</ol>
      </figure>'''
a = s.index('<figure class="product reveal">') if '<figure class="product reveal">' in s else s.index('<figure class="tour reveal"')
a = s.rindex('\n', 0, a) + 1
b = s.index('</figure>', a) + len('</figure>')   # neither figure nests another
s = s[:a] + tour + s[b:]
(ROOT / 'index.html').write_text(s, encoding='utf-8')
print('viewer frames:', s.count('class="fr"'))
