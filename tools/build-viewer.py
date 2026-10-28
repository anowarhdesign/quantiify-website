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
PANES = [['dashboard', 'setup', 'uploading', 'upload'], ['detecting', 'SLIDER'], ['takeoff'], ['estimate'], ['export']]
SLIDER_MS = 4400

s = (ROOT / 'index.html').read_text(encoding='utf-8')
a = s.index('<div class="p-photo-frame wf-viewer">')
b = s.index('<p class="wf-cap mono">', a)
viewer = s[a:b]
slider = re.search(r'<div class="ba ba-sheet"[\s\S]*?<span class="ba-tag r mono">AI-detected</span>\s*</div>', viewer).group(0)


def frame(key):
    if key == 'SLIDER':
        return f'''            <div class="fr" data-ms="{SLIDER_MS}"><div class="shot" style="--ar:1732/1040">
              {slider}
            </div></div>
'''
    img, w, h, alt, ms, ov = FRAMES[key]
    return f'''            <div class="fr" data-ms="{ms}"><div class="shot" style="--ar:{w}/{h}"><img src="assets/ui/{img}.webp" width="{w}" height="{h}" loading="lazy" alt="Quantiify: {alt}">
              <div class="an an-{key}" aria-hidden="true" style="--d:{ms / 1000}s">{ov}</div></div></div>
'''


panes = ''.join(f'''          <figure class="wf-pane" data-pane="{i}"{' hidden' if i else ''}>
{''.join(frame(k) for k in keys)}            <div class="fr-dots" aria-hidden="true">{''.join('<i></i>' for _ in keys) if len(keys) > 1 else ''}</div>
          </figure>
''' for i, keys in enumerate(PANES))
new_viewer = '<div class="p-photo-frame wf-viewer">\n' + panes + '        </div>\n        '
s = s[:a] + new_viewer + s[b:]
(ROOT / 'index.html').write_text(s, encoding='utf-8')
print('viewer frames:', s.count('class="fr"'))
