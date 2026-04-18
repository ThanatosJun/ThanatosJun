import { Router } from 'express'
import { streamChat } from '../services/chat.service'

const router = Router()

router.post('/', async (req, res) => {
  const { message, session_id } = req.body as { message: string; session_id?: string }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    await streamChat(message, session_id, res)
  } catch {
    res.write(`event: error\ndata: ${JSON.stringify({ error: 'AI 服務無回應', code: 'AI_SERVICE_UNAVAILABLE' })}\n\n`)
  } finally {
    res.end()
  }
})

export default router
