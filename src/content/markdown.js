import { Marked } from 'marked';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// A paragraph that is only `inline code` is a worked calculation: <p class="calc mono">450 m of cable</p>
const md = new Marked({
  renderer: {
    paragraph({ tokens }) {
      if (tokens.length === 1 && tokens[0].type === 'codespan') return `<p class="calc mono">${esc(tokens[0].text)}</p>\n`;
      return false;
    },
  },
});

export const renderMarkdown = src => md.parse(src);

/** Split a file into its front matter (one `key: <JSON value>` per line) and markdown body. */
export function parseFrontMatter(raw) {
  const m = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    const v = line.slice(i + 1).trim();
    try { data[line.slice(0, i).trim()] = JSON.parse(v); } catch { data[line.slice(0, i).trim()] = v; }
  }
  return { data, body: m[2] };
}
