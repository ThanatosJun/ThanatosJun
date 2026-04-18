import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token as string | undefined
  if (!token) {
    res.status(401).json({ error: '未認證', code: 'UNAUTHORIZED' })
    return
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET!)
    next()
  } catch {
    res.status(401).json({ error: 'Token 無效或已過期', code: 'UNAUTHORIZED' })
  }
}
