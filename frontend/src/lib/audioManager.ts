const audio = typeof window !== 'undefined' ? new Audio('/audio/background-music.mp3') : null

if (audio) {
  audio.loop = true
  audio.volume = 0.35
}

export const audioManager = {
  get paused() { return audio?.paused ?? true },

  play() { return audio?.play() },
  pause() { audio?.pause() },
  toggle() {
    if (!audio) return
    audio.paused ? audio.play() : audio.pause()
  },

  onStateChange(cb: () => void) {
    audio?.addEventListener('play', cb)
    audio?.addEventListener('pause', cb)
    return () => {
      audio?.removeEventListener('play', cb)
      audio?.removeEventListener('pause', cb)
    }
  },
}
