import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <span className="text-sm font-medium text-slate-500">Loading ShopKart...</span>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/products" replace />
  }

  return children
}

export default PublicRoute
