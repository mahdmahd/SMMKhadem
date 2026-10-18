import { BrowserRouter, Route, Routes } from 'react-router'

import Footer from './components/Footer'
import Header from './components/Header'
import AboutPage from './routes/AboutPage'
import ContactPage from './routes/ContactPage'
import Home from './routes/Home'
import NotFound from './routes/NotFound'
import PostPage from './routes/PostPage'
import PostsIndex from './routes/PostsIndex'
import ProjectDetail from './routes/ProjectDetail'

/**
 * App shell: fixed header, routed main, footer.
 *
 * Routing runs on BrowserRouter with the default (no) scroll restoration, and
 * the `*` route renders NotFound. On GitHub Pages the `postbuild` step copies
 * `dist/index.html` to `dist/404.html`, so deep legacy paths (`/posts/mem1/`,
 * `/projects/project-6/`) boot the SPA and resolve here instead of 404ing.
 */
function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/posts" element={<PostsIndex />} />
          <Route path="/posts/:slug" element={<PostPage />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
