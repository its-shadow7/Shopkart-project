import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useCart } from '../context/CartContext'

function ProductCard({ product, initialWishlisted = false, onWishlistChange }) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [cartFeedback, setCartFeedback] = useState('')

  const { addToCart, isInCart, getItemQuantity, itemActionState } = useCart()

  useEffect(() => {
    setIsWishlisted(initialWishlisted)
  }, [initialWishlisted])

  const isOutOfStock = product.stock <= 0
  const alreadyInCart = isInCart(product._id)
  const cartQty = getItemQuantity(product._id)
  const isAdding = itemActionState[product._id] === 'adding'

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    if (isSaving) return

    setIsSaving(true)
    setErrorMessage('')

    try {
      const response = await api.patch(`/wishlist/${product._id}/toggle`)
      const updatedStatus = response.data.isWishlisted
      setIsWishlisted(updatedStatus)
      if (onWishlistChange) {
        onWishlistChange(product._id, updatedStatus)
      }
      window.dispatchEvent(new CustomEvent('wishlistUpdated'))
    } catch (err) {
      console.error('Wishlist action error:', err)
      const msg = err.response?.data?.message || 'Unable to save product. Please try again.'
      setErrorMessage(msg)
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (isAdding || isOutOfStock) return

    setCartFeedback('')
    const result = await addToCart(product._id)
    if (result.success) {
      setCartFeedback('Added!')
      setTimeout(() => setCartFeedback(''), 2000)
    } else {
      setErrorMessage(result.message)
      setTimeout(() => setErrorMessage(''), 3500)
    }
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      
      {/* Product Image & Badges */}
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Category Tag */}
          <span className="absolute top-2.5 left-2.5 rounded-lg bg-white/90 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-slate-700 backdrop-blur-sm shadow-xs">
            {product.category}
          </span>

          {/* In Cart Indicator Tag */}
          {alreadyInCart && (
            <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-indigo-600/95 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm shadow-xs">
              {cartQty} in cart
            </span>
          )}

          {/* Top-Right Heart Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={isSaving}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-xs transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
            ) : (
              <span
                className={`text-base leading-none transition-colors ${
                  isWishlisted
                    ? 'text-rose-500'
                    : 'text-slate-400 hover:text-rose-500'
                }`}
              >
                {isWishlisted ? '♥' : '♡'}
              </span>
            )}
          </button>
        </div>

        {/* Product Details */}
        <div className="mt-3.5 space-y-1">
          <Link
            to={`/products/${product._id}`}
            className="line-clamp-1 text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors"
          >
            {product.name}
          </Link>
          <p className="text-xs text-slate-400">
            {product.category}
          </p>
        </div>
      </div>

      {/* Inline feedback */}
      {errorMessage && (
        <div className="mt-2 rounded-lg bg-rose-50 p-1.5 text-center text-[11px] font-medium text-rose-600 border border-rose-100">
          {errorMessage}
        </div>
      )}

      {cartFeedback && (
        <div className="mt-2 rounded-lg bg-emerald-50 p-1.5 text-center text-[11px] font-bold text-emerald-700 border border-emerald-100">
          {cartFeedback}
        </div>
      )}

      {/* Price & Stock & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              isOutOfStock
                ? 'bg-red-50 text-red-600 border border-red-100'
                : product.stock <= 5
                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : `${product.stock} units left`}
          </span>
        </div>

        {/* Action Buttons: Add to Cart & View Details */}
        <div className="grid grid-cols-2 gap-2">
          {/* Add to Cart Button (Task 7) */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding || (alreadyInCart && cartQty >= product.stock)}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-semibold shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : alreadyInCart && cartQty >= product.stock
                ? 'bg-amber-50 text-amber-800 border border-amber-200 cursor-not-allowed'
                : alreadyInCart
                ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100/70'
                : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
            }`}
          >
            {isAdding ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Adding...</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : alreadyInCart && cartQty >= product.stock ? (
              <span>Max Stock</span>
            ) : alreadyInCart ? (
              <span>Add Another</span>
            ) : (
              <span>Add to Cart</span>
            )}
          </button>

          {/* View Details Link */}
          <Link
            to={`/products/${product._id}`}
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-indigo-600"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
