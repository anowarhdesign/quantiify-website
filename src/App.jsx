import { Route, Routes, useLocation } from 'react-router';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Book from './pages/Book.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import CaseStudies from './pages/CaseStudies.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import Project from './pages/Project.jsx';
import Legal from './pages/Legal.jsx';
import NotFound from './pages/NotFound.jsx';
import { ROUTES, findRoute } from './routes.js';
import './styles/global.css';

const PAGES = { home: Home, about: About, book: Book, blog: Blog, post: BlogPost, cases: CaseStudies, case: CaseStudy, project: Project, legal: Legal };

export default function App() {
  const { pathname } = useLocation();
  const route = findRoute(pathname);
  return (
    <Layout route={route}>
      <Routes>
        {ROUTES.map(r => {
          const Page = PAGES[r.page];
          return <Route key={r.path} path={r.path} element={<Page {...r.props} />} />;
        })}
        <Route path="/index.html" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
