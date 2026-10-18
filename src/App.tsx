import { BrowserRouter, Route, Routes } from 'react-router'

import Footer from './components/Footer'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'
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
 * Routing runs on BrowserRouter. `ScrollToTop` restores the viewport on pathname
 * changes and leaves hash navigations anchored, so a detail route never opens at
 * the previous page's offset and `/#projects` still lands on the section. The
 * `*` route renders NotFound; on GitHub Pages the `postbuild` step copies
 * `dist/index.html` to `dist/404.html`, so a deep path (`/projects/project-6/`)
 * boots the SPA instead of the host's own 404 page.
 *
 * Two slug families are frozen and served. Projects keep the Hugo slugs
 * verbatim (`/projects/project-6`). Posts moved to title-derived slugs, so
 * `PostPage` carries an alias map from the old filenames to the canonical ones
 * (`/posts/mem1` → `/posts/a-tragedy-part-1`, and three more): an inbound link
 * to either spelling renders the post, and the canonical slug is the one the
 * index and the homepage teaser link to.
 */
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
