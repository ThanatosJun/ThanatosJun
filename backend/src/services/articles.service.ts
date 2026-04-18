import db from '../db/connection'
import type { Article, ArticleListItem } from '@shared/types'

export function getArticles(spaceId?: number, isPublished?: number): ArticleListItem[] {
  let sql = 'SELECT id, space_id, title, cover_image, is_published, created_at FROM articles WHERE 1=1'
  const params: unknown[] = []
  if (spaceId !== undefined) { sql += ' AND space_id = ?'; params.push(spaceId) }
  if (isPublished !== undefined) { sql += ' AND is_published = ?'; params.push(isPublished) }
  sql += ' ORDER BY created_at DESC'
  return db.prepare(sql).all(...params) as ArticleListItem[]
}

export function getArticleById(id: number): Article | undefined {
  return db.prepare('SELECT * FROM articles WHERE id = ?').get(id) as Article | undefined
}
