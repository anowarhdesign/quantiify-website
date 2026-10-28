"""Generate privacy.html and terms.html (Bangladesh-centric) from index.html's shell.

Run from the site root:  python tools/build-legal.py
Draft text: have it reviewed by a Bangladesh-qualified lawyer before relying on it.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
home = (ROOT / 'index.html').read_text(encoding='utf-8')
HEAD = home[:home.index('<main id="top">')]
TAIL = home[home.index('<footer'):]
UPDATED = '28 October 2026'
CONTACT = ('<p>Quantiify, a product of Conneqted Agents<br>Email: <a href="mailto:info@quantiify.ai">info@quantiify.ai</a>'
           '<br>Support: <a href="mailto:support@conneqtedagents.ai">support@conneqtedagents.ai</a>'
           '<br>Phone: <a href="tel:+14085005613">+1 (408) 500-5613</a></p>')


def to_root(html):
    html = re.sub(r'href="#([\w-]+)"', r'href="index.html#\1"', html)
    return html.replace('href="index.html#top"', 'href="index.html"')


def build(path, title, desc, eyebrow, h1, intro, sections):
    head = re.sub(r'<title>.*?</title>', f'<title>{title} · Quantiify</title>', HEAD, flags=re.S)
    head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', head)
    head = re.sub(r'(<link rel="canonical" href="[^"]*/)"', rf'\1{path}"', head)
    head = re.sub(r'(<meta property="og:url" content="[^"]*/)"', rf'\1{path}"', head)
    toc = ''.join(f'<a href="#s{i}"><span class="mono">{i:02d}</span>{t}</a>' for i, (t, _) in enumerate(sections, 1))
    body = ''.join(f'''        <section class="cs-sec" id="s{i}">
          <p class="eyebrow"><span class="ref">{i:02d}</span> {t}</p>
          <div class="prose">{b}</div>
        </section>
''' for i, (t, b) in enumerate(sections, 1))
    main = f'''<main id="top">
  <section class="hero p-hero list-hero">
    <canvas class="shader" data-shader="light" aria-hidden="true"></canvas>
    <div class="wrap">
      <nav class="crumbs mono" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><span>Legal</span><span>/</span><span aria-current="page">{title}</span></nav>
      <p class="eyebrow"><span class="ref">L</span> {eyebrow}</p>
      <h1>{h1}</h1>
      <p class="lede left">{intro}</p>
      <p class="legal-date mono">Last updated: {UPDATED} &middot; Governed by the laws of Bangladesh</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap post-wrap">
      <div class="post-main">
{body}      </div>
      <aside class="post-aside">
        <nav class="aside-toc" aria-label="Contents"><p class="mono">Contents</p>{toc}</nav>
        <div class="aside-rel"><p class="mono">Legal</p><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Service</a></div>
      </aside>
    </div>
  </section>
</main>

'''
    (ROOT / path).write_text(to_root(head) + main + to_root(TAIL), encoding='utf-8')
    print('wrote', path)


PRIVACY = [
    ('Who we are', '''<p>Quantiify is an AI-assisted construction takeoff and estimation platform built and operated by Conneqted Agents ("Quantiify", "we", "us"). This policy explains how we collect, use, store and protect personal data when you visit this website, book a demo, contact us, or use the Quantiify platform.</p>
<p>We handle personal data in line with the laws of the People&rsquo;s Republic of Bangladesh, including the Constitution of Bangladesh (Article 43, right to privacy of correspondence and communication), the Information and Communication Technology Act 2006, and the cyber security and data protection laws in force in Bangladesh from time to time.</p>'''),
    ('Information we collect', '''<p>We collect only what we need to provide and improve the service:</p>
<ul><li><b>Contact and booking details:</b> your name, work email, company, phone number, the trades you estimate and anything you write in the request form, and the details you submit when booking a demo through our calendar provider.</li>
<li><b>Account details:</b> name, email, company, role, and billing information for paid plans.</li>
<li><b>Project files:</b> drawings, specifications and other documents you upload, and the quantities, measurements, pricing and estimates you create from them.</li>
<li><b>Usage and technical data:</b> log data such as IP address, browser and device type, pages viewed, and actions taken in the platform, used for security and reliability.</li></ul>
<p>We do not knowingly collect sensitive personal data such as national identity (NID) numbers, biometric data or financial account passwords through this website.</p>'''),
    ('How we use your information', '''<ul><li>To respond to demo requests and enquiries, and to schedule calls.</li>
<li>To provide the platform: processing your drawings, running AI-assisted detection and measurement, and producing quantities, estimates and exports.</li>
<li>To manage accounts, subscriptions, invoices and VAT records.</li>
<li>To keep the service secure, prevent misuse and fix problems.</li>
<li>To improve Quantiify. We do not use your project files to train general-purpose AI models without your written permission.</li>
<li>To send service messages and, where you have agreed, product updates. You can opt out of marketing at any time.</li></ul>'''),
    ('Legal basis and consent', '''<p>We process personal data on the basis of your consent (for example when you submit the request form or book a demo), to perform our contract with you, to comply with legal obligations in Bangladesh (such as tax, VAT and record-keeping requirements), and for our legitimate interest in running a secure and reliable service. You may withdraw consent at any time; this does not affect processing that already took place.</p>'''),
    ('Sharing your information', '''<p>We do not sell personal data. We share it only with:</p>
<ul><li><b>Service providers</b> who help us run Quantiify, such as cloud hosting, email, and our calendar booking provider (Cal.com), under contracts that require them to protect it.</li>
<li><b>Payment processors and banks</b> for paid plans, in line with Bangladesh Bank requirements where applicable.</li>
<li><b>Authorities</b> when required by Bangladeshi law, a court order, or a lawful request from a competent authority.</li>
<li><b>Your team members</b> you invite to a project, who can see that project&rsquo;s files and results.</li></ul>'''),
    ('Data storage and transfers', '''<p>Our service providers may store or process data on servers outside Bangladesh. Where data leaves Bangladesh, we take reasonable steps to make sure it is protected to a standard consistent with this policy and with Bangladeshi law, and we will follow any data-localisation requirement that applies to your data.</p>'''),
    ('Retention', '''<p>We keep personal data only as long as needed for the purposes above. Project files stay in your account until you delete them or close your account; after closure we delete or anonymise them within 90 days, except where Bangladeshi law requires longer retention (for example, accounting and VAT records).</p>'''),
    ('Security', '''<p>We use encryption in transit, access controls, and logging to protect your data, and limit access to staff who need it. No system is completely secure; if a breach affects your personal data, we will notify you and the relevant Bangladeshi authorities as required by law.</p>'''),
    ('Your rights', '''<p>Subject to Bangladeshi law, you can ask us to:</p>
<ul><li>access a copy of the personal data we hold about you;</li><li>correct inaccurate data;</li><li>delete your data or close your account;</li><li>stop marketing messages;</li><li>withdraw consent you gave earlier.</li></ul>
<p>Email <a href="mailto:info@quantiify.ai">info@quantiify.ai</a>. We aim to respond within 30 days.</p>'''),
    ('Cookies and similar technologies', '''<p>This website does not use advertising or tracking cookies. Essential storage may be used by the pages and by our embedded calendar provider to make booking work. You can control cookies in your browser settings.</p>'''),
    ('Children', '''<p>Quantiify is a professional tool for construction teams and is not directed at anyone under 18. We do not knowingly collect data from children.</p>'''),
    ('Changes and contact', '''<p>We may update this policy. The &ldquo;last updated&rdquo; date shows the latest version, and we will tell account holders about material changes.</p>
<p>Questions or complaints about privacy:</p>''' + CONTACT),
]

TERMS = [
    ('Acceptance', '''<p>These Terms of Service ("Terms") govern your use of the Quantiify website and platform, provided by Conneqted Agents ("Quantiify", "we", "us"). By creating an account, booking a demo, or using the platform, you agree to these Terms. If you use Quantiify for a company, you confirm you are authorised to accept these Terms for it. These Terms are a contract under the Contract Act 1872 of Bangladesh.</p>'''),
    ('The service', '''<p>Quantiify helps estimators upload construction drawings, detect, count and measure elements with AI assistance, review quantities, apply pricing, and export estimates and BOQs. Features differ by plan and may change as we improve the product.</p>'''),
    ('Accounts', '''<p>You must give accurate information and keep your login details secure. You are responsible for activity under your account and for the team members you invite. Tell us immediately at <a href="mailto:support@conneqtedagents.ai">support@conneqtedagents.ai</a> if you suspect unauthorised access.</p>'''),
    ('Plans, fees and payment', '''<ul><li>Plans (Free, Basic (Team), Enterprise) and their prices are shown on our pricing section and may be billed monthly or annually.</li>
<li>Prices are shown in US dollars unless agreed otherwise. Where you are billed in Bangladesh, applicable VAT and supplementary duty under the Value Added Tax and Supplementary Duty Act 2012 are added as required, and payments follow Bangladesh Bank foreign-exchange rules.</li>
<li>Paid plans renew automatically until cancelled. You can cancel at any time; access continues until the end of the paid period. Fees already paid are non-refundable except where these Terms or Bangladeshi law, including the Consumer Rights Protection Act 2009 where it applies, say otherwise.</li>
<li>We may change prices with at least 30 days&rsquo; notice before your next renewal.</li></ul>'''),
    ('Your content', '''<p>You keep all rights to the drawings, documents and data you upload and to the estimates you produce ("Your Content"). You give us a limited licence to host, process and display Your Content only to provide and support the service. You confirm you have the right to upload Your Content and that doing so does not breach any confidentiality obligation, copyright or other law.</p>'''),
    ('AI output and professional responsibility', '''<p>Quantiify assists estimators; it does not replace them. AI-detected quantities, measurements and prices can be incomplete or wrong. You are responsible for reviewing, correcting and approving all output before using it in a bid, tender, contract or any construction decision. Quantiify does not provide engineering, architectural, quantity-surveying or legal advice.</p>'''),
    ('Acceptable use', '''<p>You must not:</p>
<ul><li>use Quantiify for any unlawful purpose or in breach of the Information and Communication Technology Act 2006 or Bangladesh&rsquo;s cyber security laws;</li>
<li>attempt to access other customers&rsquo; data, probe or disrupt our systems, or bypass usage limits;</li>
<li>copy, resell or reverse-engineer the platform except as permitted by law;</li>
<li>upload malware or content that infringes others&rsquo; rights.</li></ul>'''),
    ('Intellectual property', '''<p>The Quantiify platform, software, design, trademarks and documentation belong to Conneqted Agents and are protected under the Copyright Act 2023 and the Trademarks Act 2009 of Bangladesh and international law. These Terms do not transfer any of those rights to you.</p>'''),
    ('Confidentiality', '''<p>We treat Your Content and project information as confidential and use it only to provide the service. We are happy to sign a separate NDA on request.</p>'''),
    ('Availability and changes', '''<p>We aim to keep Quantiify available but do not guarantee uninterrupted service. We may carry out maintenance, and may change or discontinue features with reasonable notice where the change materially affects paid plans.</p>'''),
    ('Limitation of liability', '''<p>To the extent permitted by Bangladeshi law, Quantiify is not liable for indirect or consequential loss, lost profits, lost bids, or errors in estimates that you did not review. Our total liability for any claim is limited to the fees you paid in the 12 months before the claim. Nothing in these Terms limits liability that cannot be limited by law.</p>'''),
    ('Suspension and termination', '''<p>You may close your account at any time. We may suspend or end access if you seriously breach these Terms or fail to pay, after notice where reasonable. On termination you can export Your Content for 30 days, after which we delete it as described in our <a href="privacy.html">Privacy Policy</a>.</p>'''),
    ('Governing law and disputes', '''<p>These Terms are governed by the laws of the People&rsquo;s Republic of Bangladesh. We will first try to resolve any dispute through good-faith discussion for 30 days. If that fails, the dispute will be settled by arbitration in Dhaka under the Arbitration Act 2001, in English, by a sole arbitrator. Subject to that, the courts of Dhaka have exclusive jurisdiction.</p>'''),
    ('Contact', '''<p>Questions about these Terms:</p>''' + CONTACT),
]

build('privacy.html', 'Privacy Policy',
      'How Quantiify collects, uses and protects personal data, in line with the laws of Bangladesh.',
      'Legal', 'Privacy <em>Policy</em>',
      'How we collect, use, store and protect your information when you use Quantiify.', PRIVACY)
build('terms.html', 'Terms of Service',
      'The terms that govern use of the Quantiify website and platform, under the laws of Bangladesh.',
      'Legal', 'Terms of <em>Service</em>',
      'The agreement between you and Quantiify for using our website and platform.', TERMS)
