import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';

// keep the trailing slash: the home link is then /quantiify-website/ (no redirect)
const basename = import.meta.env.BASE_URL;
const app = <BrowserRouter basename={basename}><App /></BrowserRouter>;
const root = document.getElementById('root');

// Production pages are prerendered (scripts/prerender.mjs), so hydrate them; the dev server starts empty.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
