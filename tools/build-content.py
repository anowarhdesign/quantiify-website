"""Generate blog.html, blog/<slug>.html, case-studies.html and case-studies/<slug>.html.

Run from the site root:  python tools/build-content.py
Article text comes from tools/content/source.json (scraped from quantiify.ai);
page shell (nav, CTA band, footer) comes from index.html.
"""
import html as H
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
home = (ROOT / 'index.html').read_text(encoding='utf-8')
src = json.loads((ROOT / 'tools/content/source.json').read_text(encoding='utf-8'))


def cut(start, end, s=home):
    a = s.index(start)
    return s[a:s.index(end, a) + len(end)]


HEAD = home[:home.index('<main id="top">')]
CTA = cut('  <section id="cta"', '</section>')
TAIL = home[home.index('<footer'):]
PAGES = ('about.html', 'blog.html', 'case-studies.html', 'book.html', 'index.html')


def fix(html, depth):
    p = '../' * depth
    html = re.sub(r'href="#([\w-]+)"', rf'href="{p}index.html#\1"', html)
    html = html.replace(f'href="{p}index.html#top"', f'href="{p}index.html"')
    if depth:
        for a in ('src="assets/', 'href="assets/', 'href="styles.css', 'src="shader.js', 'src="main.js',
                  'href="projects/', 'href="blog/', 'href="case-studies/') + tuple(f'href="{x}' for x in PAGES):
            html = html.replace(a, a.replace('"', '"' + p, 1))
    return html


def page(path, title, desc, main, depth):
    head = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', HEAD, flags=re.S)
    head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{H.escape(desc)}">', head)
    head = re.sub(r'(<link rel="canonical" href="[^"]*/)"', rf'\1{path}"', head)
    head = re.sub(r'(<meta property="og:url" content="[^"]*/)"', rf'\1{path}"', head)
    out = fix(head, depth) + f'<main id="top">\n{main}\n{fix(CTA, depth)}\n</main>\n\n' + fix(TAIL, depth)
    (ROOT / path).parent.mkdir(parents=True, exist_ok=True)
    (ROOT / path).write_text(out, encoding='utf-8')
    print('wrote', path)


TRADES = ['Electrification', 'Sanitary &amp; plumbing', 'Electromechanical', 'Structural &amp; finishing']
COVER = {'Electrification': 'trade-electrification', 'Sanitary &amp; plumbing': 'trade-plumbing',
         'Electromechanical': 'trade-electromechanical', 'Structural &amp; finishing': 'trade-structural'}

# ---------------------------------------------------------------- blog
BLOG_META = {  # slug -> (trade, cover override)
    'quantity-takeoff-vs-cost-estimate-what-changes-between-them': ('Electrification', 'assets/ui/estimate.webp'),
    'lighting-and-power-takeoffs-eliminating-symbol-counting': ('Electrification', None),
    'streamlining-mechanical-takeoff-ductwork-piping': ('Electromechanical', None),
    'architectural-quantity-review-finishes-openings': ('Structural &amp; finishing', None),
    'sitework-and-earthwork-calculations-civil-estimating': ('Sanitary &amp; plumbing', None),
    'piping-schedules-valve-detection-avoiding-omissions': ('Electromechanical', 'assets/cad/electromechanical-takeoff.webp'),
}
SHORT = {
    'quantity-takeoff-vs-cost-estimate-what-changes-between-them': 'takeoff-vs-cost-estimate',
    'lighting-and-power-takeoffs-eliminating-symbol-counting': 'lighting-power-takeoffs',
    'streamlining-mechanical-takeoff-ductwork-piping': 'mechanical-ductwork-piping',
    'architectural-quantity-review-finishes-openings': 'finishes-and-openings',
    'sitework-and-earthwork-calculations-civil-estimating': 'sitework-earthwork',
    'piping-schedules-valve-detection-avoiding-omissions': 'piping-valve-omissions',
}
PLACEHOLDER_H1 = 'The Future of Construction Estimating: From Manual Takeoff'


def render_body(blocks):
    out, ul = [], []
    for tag, txt in blocks:
        t = H.escape(txt).replace(' :', ':')
        if tag == 'li':
            ul.append(f'<li>{t}</li>')
            continue
        if ul:
            out.append('<ul>' + ''.join(ul) + '</ul>'); ul = []
        if tag in ('h3', 'h4'):
            out.append(f'<h2>{t.rstrip(":").rstrip()}</h2>')
        elif re.fullmatch(r'[\d.,]+ ?m(?: of cable)?|[\d.,]+ m × \$[\d.,]+/m = \$[\d.,]+', txt):
            out.append(f'<p class="calc mono">{t}</p>')
        else:
            out.append(f'<p>{t}</p>')
    if ul:
        out.append('<ul>' + ''.join(ul) + '</ul>')
    return '\n'.join(out)


posts = []
for b in src['blogs']:
    blocks = [x for x in b['blocks']]
    h1 = blocks[0][1]
    if h1 == PLACEHOLDER_H1:      # real title sits in the subheading
        title, deck, body = blocks[1][1], '', blocks[2:]
    else:
        title, deck, body = h1, blocks[1][1], blocks[2:]
    trade, cover = BLOG_META[b['slug']]
    cover = cover or f"assets/product/{COVER[trade]}.webp"
    first_p = next(x for t, x in body if t == 'p')
    words = sum(len(x.split()) for _, x in b['blocks'])
    posts.append(dict(slug=SHORT[b['slug']], title=title, deck=deck or first_p, body=body, trade=trade, cover=cover,
                      excerpt=(first_p[:150].rsplit(' ', 1)[0] + '…') if len(first_p) > 150 else first_p,
                      mins=max(2, round(words / 200))))


def card(p, depth=0):
    pre = '../' * depth
    return f'''        <a class="post-card reveal" href="{pre}blog/{p['slug']}.html" data-trade="{p['trade']}">
          <figure><img src="{pre}{p['cover']}" loading="lazy" alt=""></figure>
          <div class="post-meta mono"><span>{p['trade']}</span><span>{p['mins']} min read</span></div>
          <h3>{H.escape(p['title'])}</h3>
          <p>{H.escape(p['excerpt'])}</p>
          <span class="link">Read article &rarr;</span>
        </a>
'''


def filters():
    chips = ''.join(f'<button type="button" data-filter="{t}">{t}</button>' for t in TRADES)
    return f'<div class="filters mono" role="group" aria-label="Filter by trade"><button type="button" data-filter="all" class="on">All</button>{chips}</div>'


blog_main = f'''  <section class="hero p-hero list-hero">
    <canvas class="shader" data-shader="light" aria-hidden="true"></canvas>
    <div class="wrap">
      <nav class="crumbs mono" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><span aria-current="page">Blog</span></nav>
      <p class="eyebrow"><span class="ref">B-01</span> Blog</p>
      <h1>Construction estimating &amp; <em>AI takeoff</em> blog</h1>
      <p class="lede left">Practical guides on construction takeoff, quantity estimation, AI-assisted workflows, drawing review, and trade-specific estimating.</p>
    </div>
  </section>
  <section class="section list-body">
    <div class="wrap">
      {filters()}
      <div class="post-grid" data-filter-grid>
{''.join(card(p) for p in posts)}      </div>
    </div>
  </section>'''
page('blog.html', 'Construction Estimating &amp; AI Takeoff Blog · Quantiify',
     'Practical guides on construction takeoff, quantity estimation, AI-assisted workflows, drawing review, and trade-specific estimating.',
     blog_main, 0)

for p in posts:
    related = [q for q in posts if q is not p and q['trade'] == p['trade']][:2]
    related += [q for q in posts if q is not p and q not in related][:3 - len(related)]
    rel = ''.join(f'<a href="{q["slug"]}.html"><span class="mono">{q["trade"]}</span>{H.escape(q["title"])}</a>' for q in related)
    main = f'''  <article class="section post">
    <div class="wrap post-wrap">
      <div class="post-main">
        <nav class="crumbs mono" aria-label="Breadcrumb"><a href="../index.html">Home</a><span>/</span><a href="../blog.html">Blog</a><span>/</span><span aria-current="page">{p['trade']}</span></nav>
        <div class="post-meta mono"><span>{p['trade']}</span><span>{p['mins']} min read</span><span>Quantiify team</span></div>
        <h1>{H.escape(p['title'])}</h1>
        <p class="post-deck">{H.escape(p['deck'])}</p>
        <figure class="p-photo post-cover"><div class="p-photo-frame"><img src="../{p['cover']}" alt=""></div></figure>
        <div class="prose">
{render_body(p['body'] if p['deck'] != p['body'][0][1] else p['body'][1:])}
        </div>
      </div>
      <aside class="post-aside">
        <div class="aside-card">
          <p class="eyebrow"><span class="ref">Q</span> See it on your drawings</p>
          <p>Bring a drawing set and watch Quantiify count and measure it.</p>
          <a class="btn btn-primary" href="../book.html">Book a demo</a>
        </div>
        <div class="aside-rel">
          <p class="mono">More articles</p>
          {rel}
          <a class="link" href="../blog.html">All articles &rarr;</a>
        </div>
      </aside>
    </div>
  </article>'''
    page(f"blog/{p['slug']}.html", f"{p['title']} · Quantiify Blog", p['excerpt'], main, 1)

# ---------------------------------------------------------------- case studies
CASES = [
    dict(slug='simplifying-electrical-estimating', trade='Electrification', live=True,
         title='Simplifying electrical estimating from drawings',
         deck='How Quantiify helps estimators turn electrical drawing pages into structured quantities and cost estimates.',
         img='assets/cad/electrification-takeoff.webp'),
    dict(slug='', trade='Electromechanical', live=False, title='Streamlining mechanical &amp; HVAC drawing takeoffs',
         deck='How mechanical estimating teams extract piping, ductwork, and equipment quantities directly from drawing schedules.',
         img='assets/cad/electromechanical-takeoff.webp'),
    dict(slug='', trade='Structural &amp; finishing', live=False, title='Accelerating architectural &amp; finish quantities',
         deck='Organizing area, perimeter, room finishes, and opening counts across coordinated architectural sheet sets.',
         img='assets/cad/structural-finishing-takeoff.webp'),
    dict(slug='', trade='Sanitary &amp; plumbing', live=False, title='Precision civil sitework takeoff from coordinated plans',
         deck='Calculating sitework, grading, paving, and underground utility quantities with full drawing traceability.',
         img='assets/cad/sanitary-plumbing-takeoff.webp'),
]


def case_card(c):
    body = f'''<figure><img src="{c['img']}" loading="lazy" alt=""></figure>
          <div class="post-meta mono"><span>{c['trade']}</span><span>Commercial building</span></div>
          <h3>{c['title']}</h3>
          <p>{c['deck']}</p>'''
    if c['live']:
        return f'''        <a class="post-card case-card reveal" href="case-studies/{c['slug']}.html" data-trade="{c['trade']}">
          {body}
          <span class="link">Read case study &rarr;</span>
        </a>
'''
    return f'''        <div class="post-card case-card soon reveal" data-trade="{c['trade']}">
          {body}
          <span class="soon-tag mono">Write-up in progress</span>
        </div>
'''


cs_main = f'''  <section class="hero p-hero list-hero">
    <canvas class="shader" data-shader="light" aria-hidden="true"></canvas>
    <div class="wrap list-hero-in">
      <div>
        <nav class="crumbs mono" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><span aria-current="page">Case studies</span></nav>
        <p class="eyebrow"><span class="ref">C-01</span> Case studies from real users</p>
        <h1>Case <em>studies</em></h1>
        <p class="lede left">See how construction teams use Quantiify to simplify drawing analysis, accelerate takeoff, and build more connected estimating workflows.</p>
      </div>
      <div class="learn">
        <p class="mono">In each case study</p>
        <ol>
          <li>Client and project context.</li>
          <li>The previous takeoff workflow and its constraints.</li>
          <li>The Quantiify workflow used for the project.</li>
          <li>How quantities were reviewed, corrected, and approved.</li>
        </ol>
      </div>
    </div>
  </section>
  <section class="section list-body">
    <div class="wrap">
      {filters()}
      <div class="post-grid" data-filter-grid>
{''.join(case_card(c) for c in CASES)}      </div>
    </div>
  </section>'''
page('case-studies.html', 'Case Studies · Quantiify',
     'See how construction teams use Quantiify to simplify drawing analysis, accelerate takeoff, and build more connected estimating workflows.',
     cs_main, 0)

# electrical case study detail (the one written on quantiify.ai)
blocks = src['cases'][0]['blocks']
h2s = [i for i, (t, _) in enumerate(blocks) if t == 'h2']
SECTIONS = ['Context', 'Problem', 'Approach', 'Solution', 'Outcome', 'Final takeaway']
secs = []
for n, i in enumerate(h2s):
    j = h2s[n + 1] if n + 1 < len(h2s) else len(blocks)
    secs.append((SECTIONS[n], blocks[i][1], blocks[i + 1:j]))


def sec_body(name, items):
    if name == 'Approach':
        chain = ''.join(f'<li><span class="mono">{k:02d}</span>{s}</li>' for k, s in
                        enumerate(['Upload', 'Analyze', 'Takeoff', 'Estimate', 'Export'], 1))
        ps = [f'<p>{H.escape(x)}</p>' for t, x in items if t == 'p']
        return ps[0] + f'<ol class="cs-chain">{chain}</ol>' + ''.join(ps[1:])
    if name == 'Outcome':
        cards, cur = [], None
        for t, x in items:
            if t == 'h3':
                cur = [x, '']; cards.append(cur)
            elif cur:
                cur[1] += x
        return '<div class="cs-out">' + ''.join(
            f'<div><h3>{H.escape(a)}</h3><p>{H.escape(b)}</p></div>' for a, b in cards) + '</div>'
    return render_body(items)


toc = ''.join(f'<a href="#s{k}"><span class="mono">{k:02d}</span>{n}</a>' for k, (n, _, _) in enumerate(secs, 1))
body = ''.join(f'''        <section class="cs-sec" id="s{k}">
          <p class="eyebrow"><span class="ref">{k:02d}</span> {n}</p>
          <h2>{H.escape(h)}</h2>
          <div class="prose">{sec_body(n, items)}</div>
        </section>
''' for k, (n, h, items) in enumerate(secs, 1))
c0 = CASES[0]
main = f'''  <section class="hero p-hero list-hero">
    <canvas class="shader" data-shader="light" aria-hidden="true"></canvas>
    <div class="wrap p-hero-in">
      <div class="p-hero-copy">
        <nav class="crumbs mono" aria-label="Breadcrumb"><a href="../index.html">Home</a><span>/</span><a href="../case-studies.html">Case studies</a><span>/</span><span aria-current="page">{c0['trade']}</span></nav>
        <div class="post-meta mono"><span>{c0['trade']}</span><span>Commercial building</span><span>Construction estimating</span></div>
        <h1>{c0['title']}</h1>
        <p class="lede left">{c0['deck']}</p>
      </div>
      <figure class="p-photo"><div class="p-photo-frame"><img src="../{c0['img']}" alt="Electrical layout with AI-detected elements"></div>
        <figcaption class="mono"><span>Fig. 01</span><span>Electrical layout plan</span></figcaption></figure>
    </div>
  </section>
  <section class="section">
    <div class="wrap post-wrap">
      <div class="post-main">
{body}      </div>
      <aside class="post-aside">
        <nav class="aside-toc" aria-label="On this page"><p class="mono">On this page</p>{toc}</nav>
        <div class="aside-card">
          <p>Want the same workflow on your drawings?</p>
          <a class="btn btn-primary" href="../book.html">Book a demo</a>
        </div>
      </aside>
    </div>
  </section>'''
page(f"case-studies/{c0['slug']}.html", f"{c0['title']} · Quantiify Case Study", c0['deck'], main, 1)
