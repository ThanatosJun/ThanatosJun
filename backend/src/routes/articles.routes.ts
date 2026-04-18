import { Router } from 'express'
import db from '../db/connection'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

router.get('/', (req, res) => {
  try {
    const { space_id, is_published } = req.query
    let sql = 'SELECT id, space_id, title, cover_image, is_published, created_at FROM articles WHERE 1=1'
    const params: unknown[] = []
    if (space_id) { sql += ' AND space_id = ?'; params.push(space_id) }
    if (is_published !== undefined) { sql += ' AND is_published = ?'; params.push(is_published) }
    sql += ' ORDER BY created_at DESC'
    const articles = db.prepare(sql).all(...params)
    res.json({ data: articles, total: articles.length })
  } catch {
    res.status(500).json({ error: '資料庫讀取失敗', code: 'DB_ERROR' })
  }
})

router.get('/:id', (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id)
    if (!article) { res.status(404).json({ error: '文章不存在', code: 'ARTICLE_NOT_FOUND' }); return }
    res.json({ data: article })
  } catch {
    res.status(500).json({ error: '資料庫讀取失敗', code: 'DB_ERROR' })
  }
})

router.post('/', authMiddleware, (req, res) => {
  try {
    const { space_id, title, content, cover_image, is_published } = req.body
    const result = db.prepare(
      'INSERT INTO articles (space_id, title, content, cover_image, is_published) VALUES (?, ?, ?, ?, ?)'
    ).run(space_id, title, content, cover_image ?? null, is_published ?? 0)
    res.status(201).json({ data: { id: result.lastInsertRowid } })
  } catch {
    res.status(500).json({ error: '資料庫寫入失敗', code: 'DB_ERROR' })
  }
})

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { title, content, cover_image, is_published } = req.body
    const result = db.prepare(
      'UPDATE articles SET title=?, content=?, cover_image=?, is_published=?, updated_at=datetime(\'now\') WHERE id=?'
    ).run(title, content, cover_image ?? null, is_published ?? 0, req.params.id)
    if (result.changes === 0) { res.status(404).json({ error: '文章不存在', code: 'ARTICLE_NOT_FOUND' }); return }
    res.json({ data: { ok: true } })
  } catch {
    res.status(500).json({ error: '資料庫寫入失敗', code: 'DB_ERROR' })
  }
})

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id)
    if (result.changes === 0) { res.status(404).json({ error: '文章不存在', code: 'ARTICLE_NOT_FOUND' }); return }
    res.json({ data: { ok: true } })
  } catch {
    res.status(500).json({ error: '資料庫刪除失敗', code: 'DB_ERROR' })
  }
})

export default router
