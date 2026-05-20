import { useConversationStore } from '../../stores/conversationStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import './chat.css'

export default function ChatPanel() {
  const { messages, error, isStreaming } = useConversationStore()

  return (
    <section aria-label="AI 對話" className="chat-panel">
      <div className="chat-header">
        <span className="chat-header-dot" />
        <span className="chat-header-title">和 Thanatos 說說話</span>
        <span className={`chat-header-status${isStreaming ? ' chat-header-status--active' : ''}`}>
          {isStreaming ? 'PROCESSING' : 'ONLINE'}
        </span>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isStreaming && (
          <div className="chat-typing">
            <span /><span /><span />
          </div>
        )}
      </div>

      {error && <p className="chat-error">{error}</p>}

      <div className="chat-input-area">
        <ChatInput />
      </div>
    </section>
  )
}
