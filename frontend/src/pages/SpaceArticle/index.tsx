import { Helmet } from 'react-helmet-async'
import Navbar from '../../components/layout/Navbar'

export default function SpaceArticle() {
  return (
    <>
      <Helmet>
        <title>ThanatosJun — 文章</title>
      </Helmet>
      <Navbar />
      <main>
        {/* Phase 2: 文章詳情頁 */}
        <p>文章載入中…</p>
      </main>
    </>
  )
}
