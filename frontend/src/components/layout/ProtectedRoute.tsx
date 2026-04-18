import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function ProtectedRoute() {
  const isAdmin = useAuthStore((s) => s.isAdmin)
  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />
}
