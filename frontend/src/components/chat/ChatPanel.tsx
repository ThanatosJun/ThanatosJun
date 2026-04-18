import { useConversationStore } from '../../stores/conversationStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

export default function ChatPanel() {
  const { messages, error } = useConversationStore()

  return (
    <section aria-label="AI 對話" className="fixed bottom-8 left-8 w-96 max-h-[60vh] flex flex-col">
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <ChatInput />
    </section>
  )
}
