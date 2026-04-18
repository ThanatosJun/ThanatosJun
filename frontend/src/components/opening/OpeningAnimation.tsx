import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function OpeningAnimation() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!visible) return
    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    })
    tl.to([leftRef.current, rightRef.current], {
      xPercent: (i) => (i === 0 ? -100 : 100),
      duration: 1.2,
      ease: 'power3.inOut',
      delay: 0.8,
    })
  }, [visible])

  if (!visible) return null

  return (
    <div ref={overlayRef} className="opening-overlay">
      <div ref={leftRef}  className="opening-curtain-left"  />
      <div ref={rightRef} className="opening-curtain-right" />
    </div>
  )
}
