import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartSuccess, setCartSuccess] = useState('')
  const [cartError, setCartError] = useState('')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [wishlistFeedback, setWishlistFeedback] = useState('')

  const { addToCart, isInCart, getItemQuantity, itemActionState } = useCart()
  const alreadyInCart = isInCart(id)
  const cartQty = getItemQuantity(id)
  const isAdding = itemActionState[id] === 'adding'

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await api.get(`/products/${id}`)
        setProduct(response.data.product)
      } catch (err) {
        console.error('Failed to fetch product details:', err)
        setError(
          err.response?.data?.message || 'Product not found or failed to load.'
        )
      } finally {
        setLoading(false)
      }
    }

    const checkWishlist = async () => {
      try {
        const res = await api.get('/wishlist')
        const found = (res.data.wishlist || []).some((item) => item._id === id)
        setIsWishlisted(found)
      } catch {
        // Guest or unauthenticated
      }
    }

    fetchProduct()
    checkWishlist()
  }, [id])

  const handleAddToCart = async () => {
    setCartSuccess('')
    setCartError('')
    const result = await addToCart(id)
    if (result.success) {
      setCartSuccess(result.message || 'Product added to cart!')
      setTimeout(() => setCartSuccess(''), 4000)
    } else {
      setCartError(result.message || 'Failed to add product to cart')
      setTimeout(() => setCartError(''), 4000)
    }
  }

  const handleWishlistToggle = async () => {
    setWishlistLoading(true)
    setWishlistFeedback('')
    try {
      const res = await api.patch(`/wishlist/${id}/toggle`)
      setIsWishlisted(res.data.isWishlisted)
      setWishlistFeedback(res.data.message)
      window.dispatchEvent(new CustomEvent('wishlistUpdated'))
      setTimeout(() => setWishlistFeedback(''), 3000)
    } catch (err) {
      setWishlistFeedback(err.response?.data?.message || 'Failed to update wishlist')
      setTimeout(() => setWishlistFeedback(''), 3000)
    } finally {
      setWishlistLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        
        {/* Breadcrumb / Back button */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>

        {/* 1. Loading State */}
        {loading && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading product details...
            </p>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-white p-12 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{error}</h3>
            <Link
              to="/products"
              className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* 3. Product Details Display */}
        {!loading && !error && product && (
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
              
              {/* Product Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Product Information */}
              <div className="flex flex-col justify-between">
                <div>
                  {/* Category & Stock Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
                      {product.category}
                    </span>
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        product.stock <= 0
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}
                    >
                      {product.stock <= 0 ? 'Out of Stock' : `${product.stock} in Stock`}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {product.name}
                  </h1>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400">Inclusive of all taxes</span>
                  </div>

                  {/* Description */}
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Description
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 border-t border-slate-100 pt-6 space-y-3">
                  {cartSuccess && (
                    <div className="rounded-xl bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-700 border border-emerald-100 flex items-center justify-between">
                      <span>✓ {cartSuccess}</span>
                      <Link to="/cart" className="underline font-bold hover:text-emerald-900">
                        View Cart →
                      </Link>
                    </div>
                  )}

                  {cartError && (
                    <div className="rounded-xl bg-rose-50 p-2.5 text-center text-xs font-semibold text-rose-700 border border-rose-100">
                      {cartError}
                    </div>
                  )}

                  {wishlistFeedback && (
                    <div className="rounded-xl bg-slate-100 p-2.5 text-center text-xs font-semibold text-slate-700 border border-slate-200">
                      {wishlistFeedback}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0 || isAdding || (alreadyInCart && cartQty >= product.stock)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer ${
                        product.stock <= 0
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                          : alreadyInCart && cartQty >= product.stock
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-none cursor-not-allowed'
                          : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20'
                      }`}
                    >
                      {isAdding ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Adding to Cart...</span>
                        </>
                      ) : product.stock <= 0 ? (
                        <span>Out of Stock</span>
                      ) : alreadyInCart && cartQty >= product.stock ? (
                        <span>Max Stock In Cart ({cartQty})</span>
                      ) : alreadyInCart ? (
                        <>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Add Another (+1) • {cartQty} in cart</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleWishlistToggle}
                      disabled={wishlistLoading}
                      className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold border transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100/70 focus:ring-4 focus:ring-rose-500/10'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-rose-600 hover:border-slate-300 focus:ring-4 focus:ring-slate-500/10'
                      }`}
                    >
                      {wishlistLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
                      ) : (
                        <span className={isWishlisted ? 'text-rose-500 text-lg leading-none' : 'text-slate-400 text-lg leading-none'}>
                          {isWishlisted ? '♥' : '♡'}
                        </span>
                      )}
                      <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default ProductDetails
