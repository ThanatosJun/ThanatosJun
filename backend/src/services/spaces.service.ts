import db from '../db/connection'
import type { Space } from '@shared/types'

export function getAllSpaces(): Space[] {
  return db.prepare('SELECT * FROM spaces').all() as Space[]
}
