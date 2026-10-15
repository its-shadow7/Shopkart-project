import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import Navbar from '../components/Navbar'
import WishlistCard from '../components/WishlistCard'

function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)

  const fetchWishlist = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/wishlist')
      setWishlist(response.data.wishlist || [])
    } catch (err) {
      console.error('Failed to load wishlist:', err)
      setError(
        err.response?.data?.message || 'Something went wrong. We couldn’t load your wishlist.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRemove = async (productId) => {
    setRemovingId(productId)
    try {
      await api.delete(`/wishlist/${productId}`)
      setWishlist((prev) => {
        const next = prev.filter((item) => item._id !== productId)
        window.dispatchEvent(
          new CustomEvent('wishlistUpdated', { detail: { count: next.length } })
        )
        return next
      })
      setActionMessage({ type: 'success', text: 'Product removed from wishlist' })
      setTimeout(() => setActionMessage(null), 3000)
    } catch (err) {
      console.error('Failed to remove product from wishlist:', err)
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to remove product. Please try again.'
      })
      setTimeout(() => setActionMessage(null), 4000)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                My Wishlist
              </h1>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-500 text-xs">
                ❤️
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Saved items to revisit and purchase later.
            </p>
          </div>

          {!loading && !error && (
            <span className="text-xs font-semibold text-slate-400 self-start sm:self-auto">
              {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved
            </span>
          )}
        </div>

        {/* Action notification toast / banner */}
        {actionMessage && (
          <div
            className={`mb-6 rounded-2xl p-3.5 text-xs font-medium transition-all ${
              actionMessage.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}
          >
            {actionMessage.text}
          </div>
        )}

        {/* 1. Loading State */}
        {loading && (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading your wishlist...
            </p>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-rose-100 bg-white p-12 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
              Something went wrong.
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              We couldn't load your wishlist. Please check your connection or try again.
            </p>
            <button
              onClick={fetchWishlist}
              className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-2xl shadow-inner">
              ❤️
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Your wishlist is empty
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 max-w-xs">
              Save products you love and find them here later when you are ready to shop.
            </p>
            <Link
              to="/products"
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all cursor-pointer"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* 4. Populated Wishlist Grid */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
                isRemoving={removingId === product._id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Wishlist
