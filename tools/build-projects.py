"""Generate the four project pages from index.html's shared parts.

Run from the site root:  python tools/build-projects.py
Copy is sourced from quantiify.ai/solutions/*; only the trade name changes.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
home = (ROOT / 'index.html').read_text(encoding='utf-8')


def cut(start, end, src=home, include_end=True):
    a = src.index(start)
    b = src.index(end, a) + (len(end) if include_end else 0)
    return src[a:b]


# ---- shared pieces taken from the homepage -------------------------------
head = cut('<!doctype html>', '</head>')
cursor = cut('<!-- CAD crosshair', '<span class="snap-tag mono"></span></div>')
nav = cut('<header class="nav">', '</header>')
book = cut('  <section id="cta"', '</section>')
footer = cut('<footer class="titleblock">', '</footer>')
status = cut('<!-- Status bar', 'Book a demo <span aria-hidden="true">&#x21B5;</span></a>\n</div>')
version = re.search(r'\?v=(\d+)', home).group(1)


def to_sub(html):
    """Rewrite homepage-relative links for a page one folder down."""
    html = html.replace('src="assets/', 'src="../assets/').replace('href="assets/', 'href="../assets/')
    html = re.sub(r'href="#([\w-]+)"', r'href="../index.html#\1"', html)
    html = html.replace('href="book.html', 'href="../book.html')
    for x in ('about.html', 'blog.html', 'case-studies.html', 'privacy.html', 'terms.html'):
        html = html.replace(f'href="{x}', f'href="../{x}')
    html = html.replace('href="#top"', 'href="../index.html"')
    html = html.replace('href="../index.html#top"', 'href="../index.html"')
    html = html.replace('href="projects/', 'href="../projects/')
    return html


PAGES = [
    dict(slug='electrification', name='Electrification', src='Electrical', photo='trade-electrification',
         title='Electrification Takeoff Software for Estimators | Quantiify',
         lede='Quantiify helps electrical estimating teams detect repeated components, organize counts, review locations, and prepare structured quantities from complex drawing sets.',
         qty=[('Devices and symbols', 'Identify repeated electrical components and organize counts by type, sheet, zone, or project structure.'),
              ('Lighting and fixtures', 'Prepare fixture quantities and review each detected item in the plan context.'),
              ('Linear measurements', 'Capture relevant lengths for conduit, cable pathways, and other measurable scope.'),
              ('Schedules and outputs', 'Move reviewed quantities into structured schedules for estimating and pricing.')],
         fit1=['Commercial fit-outs and office projects.', 'Residential and mixed-use developments.', 'Institutional, healthcare, and education projects.', 'Multi-sheet electrical drawing sets and revisions.'],
         fit2=['Commercial fit-outs and office projects.', 'Residential and mixed-use developments.', 'Institutional, healthcare, and education projects.', 'Multi-sheet electrical drawing sets and revisions.']),
    dict(slug='sanitary-plumbing', name='Sanitary &amp; plumbing', src='Civil', photo='trade-plumbing',
         title='Sanitary &amp; Plumbing Takeoff Software | Quantiify',
         lede='Quantiify helps civil estimating teams measure areas, trace utility and pipe runs, and calculate site quantities with traceable drawing references.',
         qty=[('Linear sitework', 'Measure utilities, roads, boundaries, and other linear civil scope.'),
              ('Areas and surfaces', 'Capture relevant paved, landscaped, graded, and treatment areas.'),
              ('Site components', 'Count and organize repeated civil and site elements from the plan set.'),
              ('Calculated quantities', 'Apply project logic to reviewed measurements and prepare structured outputs.')],
         fit1=['Commercial and residential site development.', 'Infrastructure and utility packages.', 'Roads, paving, landscaping, and external works.', 'Civil drawing sets with multiple plans, details, and revisions.'],
         fit2=['Commercial and residential site development.', 'Infrastructure and utility packages.', 'Roads, paving, landscaping, and external works.', 'Civil drawing sets with multiple plans, details, and revisions.']),
    dict(slug='electromechanical', name='Electromechanical', src='Mechanical', photo='trade-electromechanical',
         title='Electromechanical Takeoff Software for Estimators | Quantiify',
         lede='Quantiify helps mechanical estimators identify equipment and fixtures, measure relevant scope, organize quantities, and review every result before it moves into the estimate.',
         qty=[('Equipment and fixtures', 'Identify and organize mechanical components across plans and schedules.'),
              ('Duct and pipe measurements', 'Capture relevant linear measurements and group quantities for review.'),
              ('Areas and zones', 'Organize takeoff information by floor, zone, system, or project structure.'),
              ('Trade calculations', 'Apply workflow-specific calculations after the underlying quantity has been checked.')],
         fit1=['HVAC and building services packages.', 'Commercial and institutional projects.', 'Multi-floor mechanical systems.', 'Drawing sets that require coordinated plan and schedule review.'],
         fit2=['Commercial HVAC and plant installations.', 'Residential and mixed-use developments.', 'Hospitals, laboratories, and educational facilities.', 'Multi-sheet mechanical drawing sets and revisions.']),
    dict(slug='structural-finishing', name='Structural &amp; finishing', src='Architectural', photo='trade-structural',
         title='Structural &amp; Finishing Takeoff Software | Quantiify',
         lede='Quantiify helps architectural estimators extract room dimensions, wall lengths, finish areas, and door/window counts from coordinated drawing sets.',
         qty=[('Areas and finishes', 'Measure relevant floor, wall, ceiling, and finish areas from architectural drawings.'),
              ('Lengths and perimeters', 'Capture linear quantities for partitions, finishes, and other measurable elements.'),
              ('Openings and components', 'Count doors, windows, rooms, and repeated architectural elements.'),
              ('Structured schedules', 'Organize reviewed quantities for downstream BOQ, estimating, and reporting workflows.')],
         fit1=['Commercial interiors and fit-outs.', 'Residential and mixed-use developments.', 'Hospitality, healthcare, and education projects.', 'Large drawing sets with repeated room and finish types.'],
         fit2=['Commercial offices and retail fit-outs.', 'Residential housing and apartment schemes.', 'Institutional, education, and healthcare projects.', 'Multi-sheet architectural drawing sets and revisions.']),
]

FEATURES = [
    ('AI Drawing Intelligence', 'Analyze drawings and identify key elements automatically.'),
    ('AI-Assisted Takeoff', 'Speed up counting, measuring, and quantity takeoff.'),
    ('Cross-Floor Takeoff', 'Reuse configured takeoff data across drawing floors.'),
    ('AI Quick Optimize', 'Connect quantities with relevant pricing sources and rates.'),
    ('Structured Estimation', 'Turn takeoff quantities into organized cost estimates.'),
]
WF_TEXT = ('Upload the project drawing set. Quantiify assists with detection and measurement. Your estimator reviews '
           'the result in drawing context, corrects what needs attention, applies relevant calculations, and approves '
           'the quantities that move forward.')


def plain(s):
    return s.replace('&amp;', '&')


def page(p):
    name_lc = p['name'][0] + p['name'][1:]
    qty = ''.join(f'''          <div class="qty-card reveal"><span class="mono">{i:02d}</span><h3>{t}</h3><p>{d}</p></div>
''' for i, (t, d) in enumerate(p['qty'], 1))
    fit = lambda items: ''.join(f'<li>{x}</li>' for x in items)
    feats = ''.join(f'''          <div class="feat reveal"><span class="mono">{i:02d}</span><h3>{t}</h3><p>{d}</p></div>
''' for i, (t, d) in enumerate(FEATURES, 1))
    sub_head = to_sub(head)
    sub_head = re.sub(r'<title>.*?</title>', f'<title>{p["title"]}</title>', sub_head, flags=re.S)
    sub_head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{p["lede"]}">', sub_head)
    sub_head = re.sub(r'(<meta property="og:title" content=")[^"]*', r'\g<1>' + p['title'], sub_head)
    sub_head = re.sub(r'(<meta name="twitter:title" content=")[^"]*', r'\g<1>' + p['title'], sub_head)
    sub_head = re.sub(r'(<meta property="og:description" content=")[^"]*', r'\g<1>' + p['lede'], sub_head)
    sub_head = re.sub(r'(<meta name="twitter:description" content=")[^"]*', r'\g<1>' + p['lede'], sub_head)
    sub_head = re.sub(r'(<link rel="canonical" href="[^"]*/)"', rf'\1projects/{p["slug"]}.html"', sub_head)
    sub_head = re.sub(r'(<meta property="og:url" content="[^"]*/)"', rf'\1projects/{p["slug"]}.html"', sub_head)
    sub_head = sub_head.replace('href="styles.min.css', 'href="../styles.min.css')
    return f'''{sub_head}
<body class="subpage">

{to_sub(cursor)}

{to_sub(nav)}

<main id="top">

  <!-- HERO -->
  <section class="hero p-hero">
    <canvas class="shader" data-shader="light" aria-hidden="true"></canvas>
    <div class="ruler-v left" aria-hidden="true"></div>
    <div class="ruler-v right" aria-hidden="true"></div>
    <div class="wrap p-hero-in">
      <div class="p-hero-copy">
        <nav class="crumbs mono" aria-label="Breadcrumb"><a href="../index.html">Home</a><span>/</span><a href="../index.html#trades">Projects</a><span>/</span><span aria-current="page">{p['name']}</span></nav>
        <h1>Turn <em>{name_lc}</em> drawings into reviewable quantities without counting every manually</h1>
        <p class="lede left">{p['lede']}</p>
        <div class="cta-row left">
          <a class="btn btn-ghost" href="#workflow">See the workflow</a>
          <a class="btn btn-primary" href="../book.html">Book a call</a>
        </div>
      </div>
      <figure class="p-photo reveal">
        <div class="p-photo-frame"><img src="../assets/product/{p['photo']}.webp" width="1200" height="800" alt="{p['name']} estimation"></div>
        <figcaption class="mono"><span>Fig. 01</span><span>{p['name']}</span></figcaption>
      </figure>
    </div>
  </section>

  <!-- QUANTITIES -->
  <section id="quantities" class="section">
    <div class="wrap">
      <p class="eyebrow"><span class="ref">P-01</span> Quantities</p>
      <h2>Prepare the quantities your trade needs</h2>
      <div class="qty-wrap">
        <figure class="p-photo qty-fig reveal">
          <div class="p-photo-frame">
            <div class="ba ba-cad" data-ba role="slider" tabindex="0" aria-label="Drag to compare the CAD drawing with Quantiify's AI takeoff" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
              <img class="ba-after" src="../assets/cad/{p['slug']}-takeoff.webp" loading="lazy" alt="{p['name']} drawing with AI-detected elements highlighted by layer">
              <img class="ba-before" src="../assets/cad/{p['slug']}-cad.webp" loading="lazy" alt="">
              <div class="ba-handle" aria-hidden="true"><span><i>&#x2194;</i></span></div>
              <span class="ba-tag l mono">CAD drawing</span><span class="ba-tag r mono">AI takeoff</span>
            </div>
          </div>
          <figcaption class="mono"><span>Fig. 02 &middot; Drag to compare</span><span>Your drawing &rarr; quantities</span></figcaption>
        </figure>
        <div class="qty-grid">
{qty}        </div>
      </div>
    </div>
  </section>

  <!-- WORKFLOW -->
  <section id="workflow" class="section section-tint">
    <div class="wrap">
      <p class="eyebrow"><span class="ref">P-02</span> Estimator control remains central</p>
      <div class="wf">
        <div class="wf-copy">
          <h2>A workflow your estimator can verify</h2>
          <p class="lede left">{WF_TEXT}</p>
          <ul class="fit">{fit(p['fit1'])}</ul>
        </div>
        <figure class="p-photo wf-img reveal">
          <div class="p-photo-frame fit"><img src="../assets/ui/takeoff-cable.webp" width="1800" height="1280" loading="lazy" alt="Quantiify takeoff workspace: AI auto-detect, measurements, detected items and commit"></div>
          <figcaption class="mono"><span>Fig. 03</span><span>Takeoff workspace</span></figcaption>
        </figure>
      </div>
      <p class="eyebrow wf-eyebrow"><span class="ref">P-03</span> A workflow your estimator can verify</p>
      <div class="wf flip">
        <div class="wf-copy">
          <h2>Easy start, flexible work</h2>
          <p class="lede left">{WF_TEXT}</p>
          <ul class="fit">{fit(p['fit2'])}</ul>
        </div>
        <figure class="p-photo wf-img reveal">
          <div class="p-photo-frame fit"><img src="../assets/ui/estimate.webp" width="1800" height="1423" loading="lazy" alt="Quantiify estimation table with priced quantities"></div>
          <figcaption class="mono"><span>Fig. 04</span><span>Estimation</span></figcaption>
        </figure>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section id="features" class="section">
    <div class="wrap">
      <p class="eyebrow"><span class="ref">P-04</span> Features</p>
      <h2>Built for modern {name_lc.lower()} estimation</h2>
      <div class="feats">
{feats}      </div>
    </div>
  </section>

{to_sub(book)}
</main>

{to_sub(footer)}

{to_sub(status)}

<script defer src="../shader.min.js?v={version}"></script>
<script defer src="../main.min.js?v={version}"></script>
</body>
</html>
'''


out = ROOT / 'projects'
out.mkdir(exist_ok=True)
for p in PAGES:
    (out / f"{p['slug']}.html").write_text(page(p), encoding='utf-8')
    print('wrote', f"projects/{p['slug']}.html")
