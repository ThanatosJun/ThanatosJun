import { useEffect, useRef, useState, useCallback, type RefObject } from 'react'
import { initLive2D } from '../../lib/live2dApp'

export function useLive2D(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const [fallback, setFallback] = useState(false)
  const tapRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let aborted = false
    let destroyFn: (() => void) | undefined

    initLive2D(canvas)
      .then(controls => {
        if (aborted) {
          controls.destroy()
        } else {
          destroyFn = controls.destroy
          tapRef.current = controls.tap
        }
      })
      .catch(() => { if (!aborted) setFallback(true) })

    return () => {
      aborted = true
      tapRef.current = null
      destroyFn?.()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const tap = useCallback(() => { tapRef.current?.() }, [])

  return { fallback, tap }
}
