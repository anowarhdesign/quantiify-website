// Server entry used only at build time by scripts/prerender.mjs to turn each route into static HTML.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';
import { ROUTES, routeFile } from './routes.js';
import { headHtml, pageUrl } from './seo/head.js';
import { FAQ, PLANS } from './content/home.js';

export function render(path) {
  const basename = import.meta.env.BASE_URL;
  return renderToString(<StaticRouter basename={basename} location={basename + path.slice(1)}><App /></StaticRouter>);
}

export { ROUTES, routeFile, headHtml, pageUrl, FAQ, PLANS };
