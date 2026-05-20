import { useState } from 'react'
import { useConversationStore } from '../../stores/conversationStore'
import { useChat } from '../../hooks/useChat'

export default function ChatInput() {
  const [value, setValue] = useState('')
  const isStreaming = useConversationStore((s) => s.isStreaming)
  const { sendMessage } = useChat()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || isStreaming) return
    const msg = value.trim()
    setValue('')
    await sendMessage(msg)
  }

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="輸入訊息…"
        disabled={isStreaming}
        className="chat-input"
        aria-label="輸入訊息"
      />
      <button
        type="submit"
        disabled={isStreaming || !value.trim()}
        className="chat-send-btn"
        aria-label="送出"
      >
        →
      </button>
    </form>
  )
}
