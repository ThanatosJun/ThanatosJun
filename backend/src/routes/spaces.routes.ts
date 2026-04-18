import { Router } from 'express'
import db from '../db/connection'

const router = Router()

router.get('/', (_req, res) => {
  try {
    const spaces = db.prepare('SELECT * FROM spaces').all()
    res.json({ data: spaces })
  } catch {
    res.status(500).json({ error: '資料庫讀取失敗', code: 'DB_ERROR' })
  }
})

export default router
