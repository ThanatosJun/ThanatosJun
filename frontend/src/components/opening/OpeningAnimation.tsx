import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import '../../styles/animations.css'

interface Star {
  x: number
  y: number
  radius: number
  alpha: number
  speed: number
  twinkleSpeed: number
  twinkleOffset: number
}

export default function OpeningAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const leftRef   = useRef<HTMLDivElement>(null)
  const rightRef  = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const starsRef  = useRef<Star[]>([])
  const rafRef    = useRef<number>(0)
  const [clicked, setClicked] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      createStars()
    }

    function createStars() {
      starsRef.current = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const g = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5
      )
      g.addColorStop(0, '#0f0f2d')
      g.addColorStop(0.5, '#0a0a1a')
      g.addColorStop(1, '#050510')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const time = Date.now() * 0.001

      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * star.twinkleSpeed * 10 + star.twinkleOffset)
        const alpha   = star.alpha * (0.6 + 0.4 * twinkle)

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`
        ctx.fill()

        if (star.radius > 1) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(108, 92, 231, ${alpha * 0.15})`
          ctx.fill()
        }

        star.y += star.speed * 0.1
        if (star.y > canvas.height + 5) {
          star.y = -5
          star.x = Math.random() * canvas.width
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleClick = useCallback(() => {
    if (clicked) return
    setClicked(true)

    starsRef.current.forEach(s => { s.speed *= 8 })

    gsap.timeline({ onComplete: () => setVisible(false) })
      .to(centerRef.current, {
        opacity: 0, scale: 0.96, duration: 0.35, ease: 'power2.in',
      })
      .to([leftRef.current, rightRef.current], {
        xPercent: (i) => (i === 0 ? -100 : 100),
        duration: 1.0,
        ease: 'power3.inOut',
      }, '-=0.05')
  }, [clicked])

  if (!visible) return null

  return (
    <div className="opening-overlay" onClick={handleClick}>
      <canvas ref={canvasRef} className="opening-canvas" />

      <div className="opening-shapes" aria-hidden="true">
        <div className="shape shape-hex shape-1" />
        <div className="shape shape-hex shape-2" />
        <div className="shape shape-diamond shape-3" />
        <div className="shape shape-circle shape-4" />
        <div className="shape shape-hex shape-5" />
        <div className="shape shape-diamond shape-6" />
        <div className="shape shape-hex shape-7" />
        <div className="shape shape-circle shape-8" />
      </div>

      <div ref={leftRef}  className="opening-curtain opening-curtain-left" />
      <div ref={rightRef} className="opening-curtain opening-curtain-right" />

      <div ref={centerRef} className="opening-center">
        <div className="opening-icon" aria-hidden="true">✦</div>
        <h1>
          <span className="opening-title-en">ThanatosJun</span>
          <span className="opening-title-jp">夜天の境界</span>
        </h1>
        <div className="opening-divider" aria-hidden="true" />
        <p className="opening-subtitle">SPACE PORTFOLIO</p>
        {!clicked && <p className="opening-enter">點擊任意處進入</p>}
      </div>
    </div>
  )
}
