export interface Article {
  id: number
  space_id: number
  title: string
  content: string
  cover_image: string | null
  is_published: number
  created_at: string
  updated_at: string
}

export interface ArticleListItem {
  id: number
  space_id: number
  title: string
  cover_image: string | null
  is_published: number
  created_at: string
}
