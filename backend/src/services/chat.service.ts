import type { Response } from 'express'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL ?? 'http://ai-service:8000'

export async function streamChat(message: string, sessionId: string | undefined, res: Response) {
  const response = await fetch(`${AI_SERVICE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId }),
  })

  if (!response.ok || !response.body) {
    throw new Error('AI_SERVICE_UNAVAILABLE')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    res.write(decoder.decode(value, { stream: true }))
  }
}
