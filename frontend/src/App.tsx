import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'

const StarNight    = lazy(() => import('./pages/StarNight'))
const TechCity     = lazy(() => import('./pages/TechCity'))
const CultureCity  = lazy(() => import('./pages/CultureCity'))
const WritingWall  = lazy(() => import('./pages/WritingWall'))
const TravelPath   = lazy(() => import('./pages/TravelPath'))
const SpaceArticle = lazy(() => import('./pages/SpaceArticle'))
const AdminLogin   = lazy(() => import('./pages/admin/Login'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const ArticleEditor  = lazy(() => import('./pages/admin/ArticleEditor'))

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="loading-screen" />}>
        <Routes>
          <Route path="/" element={<StarNight />} />
          <Route path="/tech-city" element={<TechCity />} />
          <Route path="/culture-city" element={<CultureCity />} />
          <Route path="/writing-wall" element={<WritingWall />} />
          <Route path="/travel-path" element={<TravelPath />} />
          <Route path="/:spaceSlug/articles/:id" element={<SpaceArticle />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/articles/:id/edit" element={<ArticleEditor />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
