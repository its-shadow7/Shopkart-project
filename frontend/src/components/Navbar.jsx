import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { api } from '../services/api'
import { useState, useEffect } from 'react'

function Navbar() {
  const { user, setUser } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(null)

  const fetchWishlistCount = async () => {
    if (!user) {
      setWishlistCount(null)
      return
    }
    try {
      const res = await api.get('/wishlist')
      setWishlistCount(res.data.count ?? (res.data.wishlist?.length || 0))
    } catch {
      setWishlistCount(null)
    }
  }

  useEffect(() => {
    fetchWishlistCount()

    const handleWishlistUpdated = (e) => {
      if (e?.detail?.count !== undefined) {
        setWishlistCount(e.detail.count)
      } else {
        fetchWishlistCount()
      }
    }

    window.addEventListener('wishlistUpdated', handleWishlistUpdated)
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdated)
    }
  }, [user])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await api.post('/customers/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setLoggingOut(false)
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand */}
        <Link to="/products" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-md shadow-indigo-200">
            sk
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
              ShopKart
            </span>
            <span className="text-[11px] font-medium text-slate-400 -mt-0.5">
              Customer Portal
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        {user && (
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/products"
              className="rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              Products
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 transition-colors"
            >
              <span>Wishlist</span>
              {wishlistCount !== null && (
                <span className="rounded-full bg-rose-50 border border-rose-200/60 px-1.5 py-0.2 text-[10px] font-bold text-rose-600">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
            >
              <span>Cart</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold transition-all ${
                cartCount > 0
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {cartCount}
              </span>
            </Link>
            <Link
              to="/orders"
              className="rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              Orders
            </Link>
            <Link
              to="/profile"
              className="rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              Profile
            </Link>
          </nav>
        )}

        {/* User Info & Logout Button */}
        {user && (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="hidden sm:flex flex-col text-right hover:opacity-80 transition-opacity">
              <span className="text-xs text-slate-400 font-medium">Logged in as</span>
              <span className="text-sm font-semibold text-slate-800">
                {user.fullName}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/10 disabled:opacity-50 cursor-pointer"
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
