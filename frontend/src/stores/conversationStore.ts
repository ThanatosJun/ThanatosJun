import { create } from 'zustand'
import type { Message } from '@shared/types'

interface ConversationStore {
  messages: Message[]
  isStreaming: boolean
  error: string | null
  addMessage: (msg: Message) => void
  appendStreamingToken: (token: string) => void
  setStreaming: (streaming: boolean) => void
  setError: (error: string | null) => void
  clear: () => void
}

export const useConversationStore = create<ConversationStore>((set) => ({
  messages: [],
  isStreaming: false,
  error: null,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  appendStreamingToken: (token) =>
    set((s) => {
      const msgs = [...s.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') {
        msgs[msgs.length - 1] = { ...last, content: last.content + token }
      }
      return { messages: msgs }
    }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setError: (error) => set({ error }),
  clear: () => set({ messages: [], isStreaming: false, error: null }),
}))
