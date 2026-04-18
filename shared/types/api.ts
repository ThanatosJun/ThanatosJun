export interface ApiResponse<T> {
  data: T
}

export interface ApiListResponse<T> {
  data: T[]
  total: number
}

export interface ApiError {
  error: string
  code: string
}
