CREATE TABLE IF NOT EXISTS articles (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  space_id     INTEGER NOT NULL REFERENCES spaces(id),
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  cover_image  TEXT,
  is_published INTEGER DEFAULT 0,
  created_at   TEXT DEFAULT (datetime('now')),
  updated_at   TEXT DEFAULT (datetime('now'))
);
