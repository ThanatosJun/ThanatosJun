import { useEffect, useState, type RefObject } from 'react'
import { initLive2D } from '../../lib/live2dApp'

export function useLive2D(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cleanup: (() => void) | undefined

    initLive2D(canvas)
      .then(destroy => { cleanup = destroy })
      .catch(() => setFallback(true))

    return () => { cleanup?.() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { fallback }
}
