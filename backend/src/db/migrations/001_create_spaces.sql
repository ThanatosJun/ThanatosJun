CREATE TABLE IF NOT EXISTS spaces (
  id   INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

INSERT OR IGNORE INTO spaces (id, slug, name) VALUES
  (1, 'star-night',   '星夜之間'),
  (2, 'tech-city',    '科技之都'),
  (3, 'culture-city', '文明之城'),
  (4, 'writing-wall', '書寫之牆'),
  (5, 'travel-path',  '旅遊之路');
