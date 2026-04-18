import { useRef } from 'react'
import { useLive2D } from './useLive2D'

export default function Live2DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { fallback } = useLive2D(canvasRef)

  if (fallback) {
    return (
      <div className="live2d-container" aria-hidden="true">
        <img src="/images/character-fallback.png" alt="" />
      </div>
    )
  }

  return (
    <div className="live2d-container" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
