import { useState } from 'react'
import { asset } from '../../utils/asset'
import './businesscard.css'

type Platform = 'github' | 'instagram' | 'email'

const PLATFORMS: Record<Platform, { label: string; url?: string; color: string; qr?: string; email?: string }> = {
  github: {
    label: 'GitHub',
    url: 'https://github.com/ThanatosJun',
    qr: asset('qrcode/GitHub-qrcode.svg'),
    color: '#a29bfe',
  },
  instagram: {
    label: 'Instagram',
    url: 'https://www.instagram.com/thanatos_jun',
    qr: asset('qrcode/IG-qrcode.svg'),
    color: '#fd79a8',
  },
  email: {
    label: 'Email',
    email: 'thanatosjun@gmail.com',
    color: '#74b9ff',
  },
}

interface Props {
  onClose: () => void
}

export default function BusinessCard({ onClose }: Props) {
  const [platform, setPlatform] = useState<Platform>('github')
  const [copied, setCopied] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [shining, setShining] = useState(false)
  const p = PLATFORMS[platform]

  const handleCopy = () => {
    navigator.clipboard.writeText(p.email!).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleFlipperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return
    setFlipped(f => !f)
    setShining(true)
    setTimeout(() => setShining(false), 900)
  }

  return (
    <div className="bc-overlay" onClick={onClose}>
      <div className="bc-scene" onClick={e => e.stopPropagation()}>

        {shining && <div className="bc-holo-flash" />}

        <div
          className={`bc-flipper${flipped ? ' bc-flipper--flipped' : ''}`}
          onClick={handleFlipperClick}
        >
          {/* ── Front face ── */}
          <div className="bc-face bc-face-front bc-card">
            <button className="bc-close" onClick={onClose} aria-label="關閉">✕</button>

            <div className="bc-name">
              <span className="bc-name-main">Thanatos</span>
              <span className="bc-name-sub">葉羿君</span>
            </div>

            <div className="bc-img-area">
              <img src={asset('images/business-card.png')} alt="名片" className="bc-bg" />
            </div>

            <div className="bc-bottom">
              <div className="bc-tabs">
                {(Object.entries(PLATFORMS) as [Platform, typeof p][]).map(([key, val]) => (
                  <button
                    key={key}
                    className={`bc-tab${platform === key ? ' bc-tab--active' : ''}`}
                    style={platform === key ? { borderColor: val.color, color: val.color } : undefined}
                    onClick={() => setPlatform(key)}
                  >
                    {val.label}
                  </button>
                ))}
              </div>

              {p.qr ? (
                <>
                  <div className="bc-qr-wrap">
                    <img src={p.qr} alt={`${p.label} QR Code`} className="bc-qr-img" />
                  </div>
                  <a
                    className="bc-qr-hint bc-qr-hint--link"
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {p.url}
                  </a>
                </>
              ) : (
                <div className="bc-email-section">
                  <p className="bc-email-addr">{p.email}</p>
                  <button className="bc-copy-btn" onClick={handleCopy}>
                    {copied ? '已複製 ✓' : '複製'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Back face ── */}
          <div className="bc-face bc-face-back">
            <button className="bc-close" onClick={onClose} aria-label="關閉">✕</button>
            <img src={asset('images/business-card.png')} alt="" className="bc-bg" />
          </div>
        </div>
      </div>
    </div>
  )
}
