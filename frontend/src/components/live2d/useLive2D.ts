import { useEffect, useState, type RefObject } from 'react'


export function useLive2D(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return
    // Live2D SDK 初始化在此進行（需複製 Framework 至 src/lib/live2d/）
    // 初始化失敗時啟用 fallback 靜態圖
    const init = async () => {
      try {
        // TODO: 實作 Cubism SDK 初始化
        // const app = new CubismApp(canvasRef.current!)
        // await app.loadModel(MODEL_PATH)
      } catch {
        setFallback(true)
      }
    }
    init()
    return () => {
      // TODO: app.destroy()
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  return { fallback }
}
