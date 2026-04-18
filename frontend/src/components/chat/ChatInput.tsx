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
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="和 Thanatos 說說話…"
        disabled={isStreaming}
        className="flex-1 px-4 py-2 rounded-full bg-white/10 text-white text-sm placeholder:text-white/40 disabled:opacity-50"
        aria-label="輸入訊息"
      />
      <button
        type="submit"
        disabled={isStreaming || !value.trim()}
        className="px-4 py-2 rounded-full bg-purple-600 text-white text-sm disabled:opacity-50"
      >
        送出
      </button>
    </form>
  )
}
