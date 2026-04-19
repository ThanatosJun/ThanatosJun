import { useEffect, useState } from 'react'
import { audioManager } from '../../lib/audioManager'
import './musicplayer.css'

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(!audioManager.paused)

  useEffect(() => {
    const unsub = audioManager.onStateChange(() => setPlaying(!audioManager.paused))

    const autoPlay = () => {
      audioManager.play()?.catch(() => {})
      window.removeEventListener('app:interaction', autoPlay)
    }
    window.addEventListener('app:interaction', autoPlay)

    return () => {
      unsub()
      window.removeEventListener('app:interaction', autoPlay)
    }
  }, [])

  return (
    <button
      className={`mp-btn${playing ? ' mp-playing' : ''}`}
      onClick={() => audioManager.toggle()}
      aria-label={playing ? '暫停音樂' : '播放音樂'}
      title={playing ? '暫停音樂' : '播放音樂'}
    >
      <span className="mp-bars" aria-hidden="true">
        <span /><span /><span /><span />
      </span>
      {!playing && (
        <svg className="mp-icon-play" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  )
}
