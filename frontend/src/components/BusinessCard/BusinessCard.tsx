import { useState } from 'react'
import { asset } from '../../utils/asset'
import './businesscard.css'

type Platform = 'web' | 'github' | 'instagram' | 'email'

const PLATFORMS: Record<Platform, { label: string; url?: string; color: string; qr?: string; email?: string }> = {
  web: {
    label: 'Web',
    url: 'https://thanatosjun.github.io/ThanatosJun/',
    qr: asset('qrcode/Web-qrcode.svg'),
    color: '#74b9ff',
  },
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
    color: '#a8e6cf',
  },
}

interface Props {
  onClose: () => void
}

export default function BusinessCard({ onClose }: Props) {
  const [platform, setPlatform] = useState<Platform>('github')
  const [copied, setCopied] = useState(false)
  const [flipped, setFlipped] = useState(true)
  const [shining, setShining] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const p = PLATFORMS[platform]

  const handleCopy = () => {
    navigator.clipboard.writeText(p.email!).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const playFlipSound = () => {
    const ac = new AudioContext()
    const buf = ac.createBuffer(1, ac.sampleRate * 0.18, ac.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.8)
    }
    const src = ac.createBufferSource()
    src.buffer = buf

    const filter = ac.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1400
    filter.Q.value = 0.6

    const gain = ac.createGain()
    gain.gain.setValueAtTime(0.28, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18)

    src.connect(filter)
    filter.connect(gain)
    gain.connect(ac.destination)
    src.start()
  }

  const handleFlipperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return
    setFlipped(f => !f)
    setShining(true)
    playFlipSound()
    setTimeout(() => setShining(false), 900)
  }

  const handleDownload = async () => {
    if (downloading) return
    setDownloading(true)
    try {
      const scale = 2
      const W = 300

      const toDataUrl = async (url: string) => {
        const res = await fetch(url)
        const blob = await res.blob()
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }
      const loadImg = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = src
        })

      const [bgImg, qrImg] = await Promise.all([
        loadImg(await toDataUrl(asset('images/business-card.png'))),
        p.qr ? loadImg(await toDataUrl(p.qr)) : null,
      ])

      // 2:3 canvas
      const H = Math.round(W * 3 / 2)

      const canvas = document.createElement('canvas')
      canvas.width = W * scale
      canvas.height = H * scale
      const ctx = canvas.getContext('2d')!
      ctx.scale(scale, scale)

      // 1. Background image — object-fit:cover, top-aligned
      const imgScale = Math.max(W / bgImg.naturalWidth, H / bgImg.naturalHeight)
      const drawW = bgImg.naturalWidth * imgScale
      const drawH = bgImg.naturalHeight * imgScale
      const offsetX = (W - drawW) / 2
      ctx.drawImage(bgImg, offsetX, 0, drawW, drawH)

      // 2. Overall subtle dark overlay for depth
      ctx.fillStyle = 'rgba(5,5,20,0.35)'
      ctx.fillRect(0, 0, W, H)

      // 3. Top gradient — helps name text stand out
      const topGrad = ctx.createLinearGradient(0, 0, 0, H * 0.38)
      topGrad.addColorStop(0, 'rgba(5,5,20,0.55)')
      topGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = topGrad
      ctx.fillRect(0, 0, W, H * 0.38)

      // 4. Left vignette — cinematic depth
      const leftGrad = ctx.createLinearGradient(0, 0, W * 0.5, 0)
      leftGrad.addColorStop(0, 'rgba(5,5,20,0.35)')
      leftGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = leftGrad
      ctx.fillRect(0, 0, W * 0.5, H)

      // 5. Top-right purple radial glow
      const glowGrad = ctx.createRadialGradient(W, 0, 0, W, 0, 200)
      glowGrad.addColorStop(0, 'rgba(108,92,231,0.9)')
      glowGrad.addColorStop(0.5, 'rgba(108,92,231,0.4)')
      glowGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = glowGrad
      ctx.fillRect(0, 0, W, H)

      // 6. Bottom gradient overlay — starts at 75%
      const fadeStart = H * 0.75
      const fadeGrad = ctx.createLinearGradient(0, fadeStart, 0, H)
      fadeGrad.addColorStop(0, 'transparent')
      fadeGrad.addColorStop(1, 'rgba(5,5,20,0.9)')
      ctx.fillStyle = fadeGrad
      ctx.fillRect(0, fadeStart, W, H - fadeStart)

      // 7. Name overlay — anchored top-right
      ctx.textAlign = 'right'
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 19px system-ui, sans-serif'
      ctx.fillText('Thanatos', W - 19, 67)
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.font = '12px system-ui, sans-serif'
      ctx.fillText('葉羿君', W - 19, 82)

      // 8. QR / email — anchored from bottom so content always fits
      ctx.textAlign = 'center'
      if (qrImg) {
        const qrSize = 120
        const pad = 10
        const wrapSize = qrSize + pad * 2
        const urlY = H - 18
        const wrapY = urlY - 14 - wrapSize
        const wrapX = (W - wrapSize) / 2
        const labelY = wrapY - 10

        ctx.font = 'bold 14px system-ui, sans-serif'
        const labelMetrics = ctx.measureText(p.label)
        const lPadX = 14, lPadY = 6
        const lBgW = labelMetrics.width + lPadX * 2
        const lBgH = 14 + lPadY * 2
        const lBgX = (W - lBgW) / 2
        const lBgY = labelY - 14 - lPadY
        ctx.beginPath()
        ctx.roundRect(lBgX, lBgY, lBgW, lBgH, lBgH / 2)
        ctx.fillStyle = 'rgba(5,5,20,0.45)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.fillStyle = p.color
        ctx.fillText(p.label, W / 2, labelY)

        ctx.beginPath()
        ctx.roundRect(wrapX, wrapY, wrapSize, wrapSize, 12)
        ctx.fillStyle = 'rgba(5,5,20,0.45)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.drawImage(qrImg, wrapX + pad, wrapY + pad, qrSize, qrSize)

        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.font = '9px system-ui, sans-serif'
        ctx.fillText(p.url!, W / 2, urlY)
      } else {
        ctx.fillStyle = p.color
        ctx.font = 'bold 14px system-ui, sans-serif'
        ctx.fillText(p.label, W / 2, H - 50)
        ctx.fillStyle = 'rgba(255,255,255,0.75)'
        ctx.font = '13px system-ui, sans-serif'
        ctx.fillText(p.email!, W / 2, H - 28)
      }

      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `thanatos-${platform}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 'image/png')
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="bc-overlay" onClick={onClose}>
      <div className="bc-wrapper" onClick={e => e.stopPropagation()}>
        <div className="bc-scene">

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
                      className={`bc-tab${platform === key ? ' bc-tab--active' : ''}${key === 'web' ? ' bc-tab--web' : ''}`}
                      style={platform === key ? { borderColor: val.color, color: val.color } : undefined}
                      onClick={() => setPlatform(key)}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>

                <div className="bc-content-slot">
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
            </div>

            {/* ── Back face ── */}
            <div className="bc-face bc-face-back">
              <button className="bc-close" onClick={onClose} aria-label="關閉">✕</button>
              <img src={asset('images/business-card.png')} alt="" className="bc-bg" />
            </div>
          </div>
        </div>

        <button
          className="bc-download-btn"
          onClick={handleDownload}
          disabled={downloading}
          aria-label="下載名片"
        >
          {downloading ? '下載中…' : '↓ 儲存名片'}
        </button>
      </div>
    </div>
  )
}
