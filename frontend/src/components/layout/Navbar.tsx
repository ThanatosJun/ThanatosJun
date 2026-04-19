import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import MusicPlayer from '../ui/MusicPlayer'
import './navbar.css'

const spaces = [
  { path: '/',             label: '星夜之間', symbol: '✦' },
  { path: '/tech-city',    label: '科技之都', symbol: '◈' },
  { path: '/culture-city', label: '文明之城', symbol: '◎' },
  { path: '/writing-wall', label: '書寫之牆', symbol: '⟡' },
  { path: '/travel-path',  label: '旅遊之路', symbol: '◇' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/')
    window.dispatchEvent(new Event('app:show-opening'))
  }

  return (
    <nav className={`nb-nav${scrolled ? ' nb-scrolled' : ''}`} aria-label="主要導覽">
      <a href="/" className="nb-brand" onClick={handleBrandClick} aria-label="回首頁">
        <span className="nb-brand-star">✦</span>
        <span className="nb-brand-name">ThanatosJun</span>
      </a>

      <div className="nb-links">
        {spaces.map(s => (
          <NavLink
            key={s.path}
            to={s.path}
            end={s.path === '/'}
            className={({ isActive }) => `nb-link${isActive ? ' nb-active' : ''}`}
          >
            <span className="nb-link-symbol">{s.symbol}</span>
            <span className="nb-link-label">{s.label}</span>
          </NavLink>
        ))}
        <div className="nb-divider" aria-hidden="true" />
        <MusicPlayer />
      </div>
    </nav>
  )
}
