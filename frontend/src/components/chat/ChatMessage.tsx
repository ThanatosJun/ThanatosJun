import type { Message } from '../../types'

interface Props {
  message: Message
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'
  return (
    <div className={isUser ? 'chat-msg-user' : 'chat-msg-ai'}>
      {message.content}
    </div>
  )
}
