import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function Login() {
  const [password, setPassword] = useState('')
  const { setAdmin, setError, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'UNAUTHORIZED')
      }
      setAdmin(true)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'UNAUTHORIZED')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold">後台登入</h1>
        {error && <p className="text-red-400">{error}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="管理員密碼"
          className="px-4 py-2 rounded bg-white/10 text-white"
          required
        />
        <button type="submit" className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">
          登入
        </button>
      </form>
    </main>
  )
}
