import type { Message } from '../../types'

interface Props {
  message: Message
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
          isUser ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/90'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
