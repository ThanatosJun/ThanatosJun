import { useRef, useState, useEffect, useCallback } from 'react'
import { useLive2D } from './useLive2D'

const BASE_W = 300
const BASE_H = 500

const DIALOGUES = [
  'こんにちは！元気ですか？',
  'うふふ、くすぐったいですよ...',
  'また話しかけてくれたの？嬉しい！',
  'えへへ、照れちゃう...',
  'わぁ！びっくりした！',
  '今日もいい天気ですね！',
  'もっと遊びましょう！',
  'あなたのこと、気になります！',
  '頑張ってますよ、見ててね！',
  'ねぇ、何か用ですか？',
]

const MALE_JA_VOICES = ['otoya', 'ichiro', 'keita']

function pickJaFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  const jaVoices = voices.filter(v => v.lang.startsWith('ja'))
  if (jaVoices.length === 0) return null
  const female = jaVoices.find(
    v => !MALE_JA_VOICES.some(m => v.name.toLowerCase().includes(m))
  )
  return female ?? jaVoices[0]
}

function speakJa(text: string) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'ja-JP'
  utt.rate = 0.95
  utt.pitch = 1.2
  const voice = pickJaFemaleVoice()
  if (voice) utt.voice = voice
  window.speechSynthesis.speak(utt)
}

export default function Live2DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { fallback, tap } = useLive2D(canvasRef)

  const [expanded, setExpanded] = useState(true)
  const [pos, setPos]       = useState({ right: 32, bottom: 0 })
  const [scale, setScale]   = useState(1)
  const [bubble, setBubble] = useState<string | null>(null)

  const dragging    = useRef(false)
  const resizing    = useRef(false)
  const hasDragged  = useRef(false)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragStart   = useRef({ mouseX: 0, mouseY: 0, right: 32, bottom: 0 })
  const resizeStart = useRef({ mouseX: 0, mouseY: 0, scale: 1 })

  const onContainerMouseDown = useCallback((e: React.MouseEvent) => {
    if (!expanded) return
    dragging.current  = true
    hasDragged.current = false
    dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, ...pos }
    e.preventDefault()
  }, [pos, expanded])

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    resizing.current  = true
    resizeStart.current = { mouseX: e.clientX, mouseY: e.clientY, scale }
    e.stopPropagation()
    e.preventDefault()
  }, [scale])

  const handleContainerClick = useCallback(() => {
    if (!expanded || hasDragged.current) return
    tap()
    const line = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)]
    setBubble(line)
    speakJa(line)
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    bubbleTimer.current = setTimeout(() => setBubble(null), 3500)
  }, [expanded, tap])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) {
        const dx = e.clientX - dragStart.current.mouseX
        const dy = e.clientY - dragStart.current.mouseY
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true
        setPos({
          right:  Math.max(0, dragStart.current.right  - dx),
          bottom: Math.max(0, dragStart.current.bottom - dy),
        })
      }
      if (resizing.current) {
        const dx = resizeStart.current.mouseX - e.clientX
        const dy = resizeStart.current.mouseY - e.clientY
        const delta = (dx + dy) / 2
        setScale(Math.max(0.4, Math.min(2.5, resizeStart.current.scale + delta / 200)))
      }
    }
    const onUp = () => { dragging.current = false; resizing.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  useEffect(() => () => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    window.speechSynthesis?.cancel()
  }, [])

  const W = Math.round(BASE_W * scale)
  const H = Math.round(BASE_H * scale)

  return (
    <>
      {!expanded && (
        <button className="live2d-fab" onClick={() => setExpanded(true)} aria-label="顯示角色">
          ✦
        </button>
      )}

      <div
        className="live2d-container"
        style={{
          width: W, height: H,
          right: `${pos.right}px`, bottom: `${pos.bottom}px`,
          opacity: expanded ? 1 : 0,
          pointerEvents: expanded ? 'auto' : 'none',
          cursor: 'grab',
        }}
        onMouseDown={onContainerMouseDown}
        onClick={handleContainerClick}
        aria-hidden="true"
      >
        {/* 縮放把手（左上角） */}
        <div
          className="live2d-resize-handle"
          onMouseDown={onResizeMouseDown}
          onClick={e => e.stopPropagation()}
        />

        {/* 收起按鈕 */}
        <button
          className="live2d-minimize-btn"
          onClick={e => { e.stopPropagation(); setExpanded(false) }}
          onMouseDown={e => e.stopPropagation()}
          aria-label="收起角色"
        >
          ─
        </button>

        {/* 說話框 */}
        {bubble && (
          <div className="live2d-bubble" key={bubble}>
            {bubble}
          </div>
        )}

        {fallback ? (
          <img src="/images/character-fallback.png" alt="" style={{ width: '100%', height: '100%' }} />
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>
    </>
  )
}
