#!/usr/bin/env bash
# Rebuild every generated page, minify assets and run the SEO pass.
# Run from the site root:  bash tools/build-all.sh
set -e
cd "$(dirname "$0")/.."

# minified assets the pages load (sources stay readable)
npx -y esbuild@0.24.0 styles.css --minify --outfile=styles.min.css --log-level=warning
npx -y esbuild@0.24.0 main.js --minify --outfile=main.min.js --log-level=warning
npx -y esbuild@0.24.0 shader.js --minify --outfile=shader.min.js --log-level=warning

# cache-busting version for all pages
python - <<'EOF'
import re, time
s = open('index.html', encoding='utf-8').read()
s = re.sub(r'\?v=\d+', '?v=' + time.strftime('%Y%m%d%H%M%S'), s)
open('index.html', 'w', encoding='utf-8').write(s)
EOF

python tools/build-viewer.py
python tools/build-book.py
python tools/build-projects.py
python tools/build-about.py
python tools/build-content.py
python tools/build-legal.py
python tools/add-srcset.py
python tools/seo.py
