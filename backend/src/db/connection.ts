import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = process.env.DB_PATH ?? path.join('data', 'app.sqlite')

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

const MIGRATIONS_DIR = path.join(__dirname, 'migrations')
const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort()
for (const file of migrationFiles) {
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8')
  db.exec(sql)
}

export default db
