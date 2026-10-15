import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function WishlistCard({ product, onRemove, isRemoving }) {
  const { addToCart, isInCart, getItemQuantity, itemActionState } = useCart()
  const [feedback, setFeedback] = useState('')

  const isOutOfStock = product.stock <= 0
  const alreadyInCart = isInCart(product._id)
  const cartQty = getItemQuantity(product._id)
  const isAdding = itemActionState[product._id] === 'adding'

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return
    setFeedback('')
    const result = await addToCart(product._id)
    if (result.success) {
      setFeedback('Added to cart!')
      setTimeout(() => setFeedback(''), 2500)
    } else {
      setFeedback(result.message)
      setTimeout(() => setFeedback(''), 3500)
    }
  }

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      {/* Product Image & Category Badge */}
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute top-2.5 left-2.5 rounded-lg bg-white/90 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-slate-700 backdrop-blur-sm shadow-xs">
            {product.category}
          </span>
          {alreadyInCart && (
            <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-indigo-600/95 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm shadow-xs">
              {cartQty} in cart
            </span>
          )}
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

      {feedback && (
        <div className="mt-2 rounded-lg bg-indigo-50 p-1.5 text-center text-[11px] font-bold text-indigo-700 border border-indigo-100">
          {feedback}
        </div>
      )}

      {/* Price & Stock Status & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            ₹{product.price?.toLocaleString('en-IN')}
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

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding || (alreadyInCart && cartQty >= product.stock)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white shadow-xs shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isAdding ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Adding...</span>
            </>
          ) : isOutOfStock ? (
            <span>Out of Stock</span>
          ) : alreadyInCart && cartQty >= product.stock ? (
            <span>Max Stock Reached</span>
          ) : alreadyInCart ? (
            <span>Add Another (+1)</span>
          ) : (
            <span>Move to Cart</span>
          )}
        </button>

        {/* Secondary Buttons: View Details & Remove */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-indigo-600"
          >
            View Details
          </Link>

          <button
            onClick={() => onRemove(product._id)}
            disabled={isRemoving}
            className="flex items-center justify-center gap-1 rounded-xl border border-red-100 bg-red-50/50 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100/70 hover:text-red-700 disabled:opacity-50 cursor-pointer"
          >
            {isRemoving ? (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            ) : (
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
            <span>{isRemoving ? 'Removing...' : 'Remove'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default WishlistCard
