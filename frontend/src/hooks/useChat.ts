import { useConversationStore } from '../stores/conversationStore'
import { parseSseStream } from '../utils/sseParser'
import type { Message } from '@shared/types'

export function useChat() {
  const { addMessage, appendStreamingToken, setStreaming, setError } = useConversationStore()

  const sendMessage = async (content: string, sessionId?: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    addMessage(userMsg)

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
    }
    addMessage(assistantMsg)
    setStreaming(true)
    setError(null)

    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, session_id: sessionId }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error ?? 'AI_SERVICE_UNAVAILABLE')
      }

      for await (const chunk of parseSseStream(response)) {
        try {
          const parsed = JSON.parse(chunk)
          if (parsed.token) appendStreamingToken(parsed.token)
        } catch {
          // ignore malformed chunks
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI_SERVICE_UNAVAILABLE')
    } finally {
      setStreaming(false)
    }
  }

  return { sendMessage }
}
