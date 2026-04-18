import { NavLink } from 'react-router-dom'

const spaces = [
  { path: '/',             label: '星夜之間' },
  { path: '/tech-city',    label: '科技之都' },
  { path: '/culture-city', label: '文明之城' },
  { path: '/writing-wall', label: '書寫之牆' },
  { path: '/travel-path',  label: '旅遊之路' },
]

export default function Navbar() {
  return (
    <nav aria-label="主要導覽" className="fixed top-0 left-0 right-0 z-50 flex gap-6 px-8 py-4">
      {spaces.map((s) => (
        <NavLink
          key={s.path}
          to={s.path}
          end={s.path === '/'}
          className={({ isActive }) => isActive ? 'text-purple-400' : 'text-white/70 hover:text-white'}
        >
          {s.label}
        </NavLink>
      ))}
    </nav>
  )
}
