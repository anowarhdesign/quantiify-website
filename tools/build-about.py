"""Generate about.html from index.html's shared parts.

Run from the site root:  python tools/build-about.py
Copy is sourced from quantiify.ai/about.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
home = (ROOT / 'index.html').read_text(encoding='utf-8')


def cut(start, end, src=home):
    a = src.index(start)
    return src[a:src.index(end, a) + len(end)]


def to_root(html):
    html = re.sub(r'href="#([\w-]+)"', r'href="index.html#\1"', html)
    return html.replace('href="index.html#top"', 'href="index.html"')


head = home[:home.index('<main id="top">')]
cta = cut('  <section id="cta"', '</section>')
tail = home[home.index('<footer'):]

head = re.sub(r'<title>.*?</title>', '<title>About Quantiify · AI Takeoff for Estimators</title>', head, flags=re.S)
desc = ('Quantiify helps construction estimators spend less time on repetitive quantity preparation '
        'and more time on the decisions that need experience, context and judgment.')
head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', head)
head = re.sub(r'(<link rel="canonical" href="[^"]*/)"', r'\1about.html"', head)
head = re.sub(r'(<meta property="og:url" content="[^"]*/)"', r'\1about.html"', head)

STEPS = [('Upload', 'Add construction document for your project.', 'upload'),
         ('Analyze', 'Let AI understand &amp; classify your project.', 'analyze'),
         ('Takeoff', 'Measure, refine, and stay in control.', 'takeoff-cable'),
         ('Estimate', 'Turn quantities into a confident estimate.', 'estimate'),
         ('Export', 'Create and share your final estimate.', 'export')]
BELIEFS = [('Technology should amplify expertise.',
            'The future of estimating isn&rsquo;t about replacing human judgment. It&rsquo;s about giving it better tools.'),
           ('AI should make repetitive work easier.', 'And results easier to inspect.'),
           ('Every quantity needs context.',
            'The drawing, sheet, detail, and assumption behind a result matter.'),
           ('Trades are different.',
            'Electrical, mechanical, architectural, and civil workflows should not be forced into one generic model.'),
           ('The estimator stays in control.',
            'Professionals must be able to review, correct, approve, and explain the output.')]

steps = ''.join(f'''        <li class="ab-step reveal"><figure><img src="assets/ui/{img}.webp" loading="lazy" alt="Quantiify {t} screen"></figure>
          <span class="mono">{i:02d}</span><h3>{t}</h3><p>{d}</p></li>
''' for i, (t, d, img) in enumerate(STEPS, 1))
beliefs = ''.join(f'''        <div class="ab-belief reveal"><span class="mono">{i:02d}</span><h3>{t}</h3><p>{d}</p></div>
''' for i, (t, d) in enumerate(BELIEFS, 1))

OFFER = (ROOT / 'tools/content/offer.html').read_text(encoding='utf-8')

main = f'''<main id="top">

  <!-- HERO -->
  <section class="hero p-hero ab-hero">
    <canvas class="shader" data-shader="light" aria-hidden="true"></canvas>
    <div class="ruler-v left" aria-hidden="true"></div>
    <div class="ruler-v right" aria-hidden="true"></div>
    <div class="wrap p-hero-in">
      <div class="p-hero-copy">
        <nav class="crumbs mono" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><span aria-current="page">About</span></nav>
        <p class="eyebrow"><span class="ref">A-01</span> About Quantiify</p>
        <h1>Better estimates begin with <em>better quantity preparation.</em></h1>
        <p class="lede left">Construction estimators bring experience, context, and judgment to every project. Too much of their time is still consumed by repetitive work around the estimate: finding sheets, counting symbols, measuring geometry, checking calculations, and re-entering information across tools.</p>
        <div class="cta-row left">
          <a class="btn btn-primary" href="book.html">Book a call</a>
          <a class="btn btn-ghost" href="index.html#pricing">Choose a plan</a>
        </div>
      </div>
      <figure class="p-photo reveal">
        <div class="p-photo-frame">
          <div class="ba ba-cad" data-ba role="slider" tabindex="0" aria-label="Drag to compare a CAD drawing with Quantiify's AI takeoff" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="aspect-ratio:1034/748">
            <img class="ba-after" src="assets/cad/electrification-takeoff.webp" width="1034" height="748" alt="Electrical layout with AI-detected elements highlighted">
            <img class="ba-before" src="assets/cad/electrification-cad.webp" width="1034" height="748" alt="">
            <div class="ba-handle" aria-hidden="true"><span><i>&#x2194;</i></span></div>
            <span class="ba-tag l mono">CAD drawing</span><span class="ba-tag r mono">AI takeoff</span>
          </div>
        </div>
        <figcaption class="mono"><span>Fig. 01 &middot; Drag to compare</span><span>Behind Quantiify</span></figcaption>
      </figure>
    </div>
  </section>

  <!-- VISION / MISSION -->
  <section class="section section-tint">
    <div class="wrap ab-vm">
      <article class="ab-vm-card reveal">
        <p class="eyebrow"><span class="ref">A-02</span> A future where human is in the loop</p>
        <h2>Our vision</h2>
        <p>We envision a construction industry where AI takes care of repetitive complexity while estimators stay focused on the decisions that require experience, context, and judgment.</p>
        <p>Quantiify is working toward a future where every estimator has intelligent technology beside them helping them understand more, work faster, and estimate with greater confidence.</p>
      </article>
      <article class="ab-vm-card reveal">
        <p class="eyebrow"><span class="ref">A-03</span> AI that works with estimators</p>
        <h2>Our mission</h2>
        <p>Our mission is to simplify construction estimating by automating repetitive work, connecting critical project information, and surfacing useful insights at the right moment.</p>
        <p>From drawings to takeoffs, calculations to pricing, Quantiify helps teams move through the estimating process with less friction while keeping every important decision in the hands of the estimator.</p>
      </article>
    </div>
  </section>

{OFFER}

  <!-- APPROACH -->
  <section class="section">
    <div class="wrap">
      <p class="eyebrow"><span class="ref">A-05</span> Our approach</p>
      <h2>Five steps, one connected workflow.</h2>
      <ol class="ab-steps">
{steps}      </ol>
    </div>
  </section>

  <!-- BELIEFS -->
  <section class="section section-dark">
    <canvas class="shader" data-shader="dark" aria-hidden="true"></canvas>
    <div class="wrap">
      <p class="eyebrow light"><span class="ref">A-06</span> What we believe</p>
      <h2>Built for the way estimators actually work.</h2>
      <div class="ab-beliefs">
{beliefs}      </div>
    </div>
  </section>

{cta}
</main>

'''

page = to_root(head) + main + to_root(tail)
(ROOT / 'about.html').write_text(page, encoding='utf-8')
print('wrote about.html')
