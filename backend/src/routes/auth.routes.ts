import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db/connection'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

router.post('/login', (req, res) => {
  try {
    const { password } = req.body as { password: string }
    const admin = db.prepare('SELECT password_hash FROM admin_users WHERE id = 1').get() as
      | { password_hash: string }
      | undefined

    const hash = admin?.password_hash ?? process.env.ADMIN_PASSWORD_HASH ?? ''
    const valid = bcrypt.compareSync(password, hash)
    if (!valid) {
      res.status(401).json({ error: '密碼錯誤', code: 'UNAUTHORIZED' })
      return
    }

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.json({ data: { ok: true } })
  } catch (err) {
    res.status(500).json({ error: '伺服器錯誤', code: 'DB_ERROR' })
  }
})

router.post('/logout', (_req, res) => {
  res.clearCookie('token')
  res.json({ data: { ok: true } })
})

router.get('/me', authMiddleware, (_req, res) => {
  res.json({ data: { role: 'admin' } })
})

export default router
