import { useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './starmap.css'

interface Node {
  id: string
  path: string
  label: string
  labelEn: string
  img: string
  x: number
  y: number
  isCenter?: boolean
  glowColor: string
}

const CENTER_X = 50
const CENTER_Y = 48

const nodes: Node[] = [
  {
    id: 'starnight',
    path: '/',
    label: '星夜之間',
    labelEn: 'Star Night',
    img: '/images/starmap/node-starnight.png',
    x: CENTER_X, y: CENTER_Y,
    isCenter: true,
    glowColor: '#c8d2ff',
  },
  {
    id: 'techcity',
    path: '/tech-city',
    label: '科技之都',
    labelEn: 'Tech City',
    img: '/images/starmap/node-techcity.png',
    x: 22, y: 20,
    glowColor: '#74b9ff',
  },
  {
    id: 'culture',
    path: '/culture-city',
    label: '文明之城',
    labelEn: 'Culture City',
    img: '/images/starmap/node-culture.png',
    x: 74, y: 18,
    glowColor: '#fdcb6e',
  },
  {
    id: 'writing',
    path: '/writing-wall',
    label: '書寫之牆',
    labelEn: 'Writing Wall',
    img: '/images/starmap/node-writing.png',
    x: 20, y: 70,
    glowColor: '#a29bfe',
  },
  {
    id: 'travel',
    path: '/travel-path',
    label: '旅遊之路',
    labelEn: 'Travel Path',
    img: '/images/starmap/node-travel.png',
    x: 76, y: 72,
    glowColor: '#81ecec',
  },
]

const outerNodes = nodes.filter(n => !n.isCenter)

export default function StarMap() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleNodeClick = useCallback((n: Node) => {
    if (n.isCenter && pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(n.path)
    }
  }, [navigate, pathname])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setOffset({
      x: (e.clientX - cx) / rect.width,
      y: (e.clientY - cy) / rect.height,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 })
    setHovered(null)
  }, [])

  return (
    <section
      ref={containerRef}
      className="sm-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="星圖導航"
    >
      {/* CSS star particles */}
      <div className="sm-stars" aria-hidden="true" />

      {/* Constellation SVG lines */}
      <svg
        className="sm-lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          transform: `translate(${offset.x * -6}px, ${offset.y * -6}px)`,
        }}
      >
        <defs>
          {outerNodes.map(n => (
            <linearGradient
              key={n.id}
              id={`lg-${n.id}`}
              x1={`${CENTER_X}%`} y1={`${CENTER_Y}%`}
              x2={`${n.x}%`} y2={`${n.y}%`}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#c8d2ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor={n.glowColor} stopOpacity="0.3" />
            </linearGradient>
          ))}
        </defs>

        {outerNodes.map(n => (
          <g key={n.id}>
            {/* Base line */}
            <line
              x1={CENTER_X} y1={CENTER_Y}
              x2={n.x} y2={n.y}
              stroke={`url(#lg-${n.id})`}
              strokeWidth="0.15"
            />
            {/* Animated flowing dots */}
            <line
              x1={CENTER_X} y1={CENTER_Y}
              x2={n.x} y2={n.y}
              stroke={n.glowColor}
              strokeWidth="0.2"
              strokeDasharray="1 4"
              strokeOpacity={hovered === n.id ? 0.9 : 0.35}
              className="sm-line-flow"
            />
          </g>
        ))}
      </svg>

      {/* Nodes */}
      <div
        className="sm-nodes"
        style={{
          transform: `translate(${offset.x * 14}px, ${offset.y * 14}px)`,
        }}
      >
        {nodes.map(n => (
          <button
            key={n.id}
            className={`sm-node${n.isCenter ? ' sm-node-center' : ''}${hovered === n.id ? ' sm-node-hovered' : ''}`}
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              '--glow': n.glowColor,
            } as React.CSSProperties}
            onClick={() => handleNodeClick(n)}
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            aria-label={n.label}
          >
            <img src={n.img} alt={n.label} className="sm-node-img" />
            <div className="sm-node-label">
              <span className="sm-node-label-zh">{n.label}</span>
              <span className="sm-node-label-en">{n.labelEn}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom hint */}
      <p className="sm-hint">選擇一個空間進入</p>
    </section>
  )
}
