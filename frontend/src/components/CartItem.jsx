import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CartItem({ item }) {
  const { updateQuantity, removeFromCart, itemActionState } = useCart()

  const product = item.product
  const quantity = item.quantity
  const productId = product?._id

  const actionState = itemActionState[productId]
  const isUpdating = actionState === 'updating'
  const isRemoving = actionState === 'removing'
  const isBusy = isUpdating || isRemoving

  if (!product) return null

  const isAtMaxStock = quantity >= product.stock
  const isLowStock = product.stock <= 5 && product.stock > 0
  const isStockExceeded = quantity > product.stock
  const lineTotal = (product.price || 0) * quantity

  const handleDecrease = () => {
    if (quantity > 1 && !isBusy) {
      updateQuantity(productId, quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (!isAtMaxStock && !isBusy) {
      updateQuantity(productId, quantity + 1)
    }
  }

  const handleRemove = () => {
    if (!isBusy) {
      removeFromCart(productId)
    }
  }

  return (
    <div className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition-all ${
      isRemoving ? 'opacity-50 scale-[0.99] border-red-200' : 'border-slate-100 hover:border-slate-200'
    }`}>
      
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Link
          to={`/products/${productId}`}
          className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </Link>

        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            {product.category}
          </span>
          <Link
            to={`/products/${productId}`}
            className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-1 hover:text-indigo-600 transition-colors"
          >
            {product.name}
          </Link>
          
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-slate-500">Unit Price:</span>
            <span className="text-xs font-semibold text-slate-700">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Stock Badges / Warnings */}
          <div className="mt-1.5 flex items-center gap-2">
            {isStockExceeded ? (
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-100">
                Exceeds available stock ({product.stock} max)
              </span>
            ) : isAtMaxStock ? (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-100">
                Max stock reached ({product.stock} available)
              </span>
            ) : isLowStock ? (
              <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700 border border-orange-100">
                Only {product.stock} left
              </span>
            ) : (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                In Stock ({product.stock} available)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Controls & Line Total & Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        
        {/* Quantity Stepper */}
        <div className="flex flex-col items-center">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-2xs">
            <button
              onClick={handleDecrease}
              disabled={quantity <= 1 || isBusy}
              aria-label="Decrease quantity"
              title={quantity <= 1 ? "Minimum quantity is 1. Click Remove to delete." : "Decrease quantity by 1"}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 font-bold shadow-2xs transition-all hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              -
            </button>

            <span className="w-10 text-center text-xs sm:text-sm font-bold text-slate-800">
              {isUpdating ? (
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              ) : (
                quantity
              )}
            </span>

            <button
              onClick={handleIncrease}
              disabled={isAtMaxStock || isBusy}
              aria-label="Increase quantity"
              title={isAtMaxStock ? "Cannot exceed product inventory" : "Increase quantity by 1"}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 font-bold shadow-2xs transition-all hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              +
            </button>
          </div>
          {quantity <= 1 && (
            <span className="text-[10px] text-slate-400 mt-1">Min: 1</span>
          )}
        </div>

        {/* Line Total */}
        <div className="text-right min-w-[90px]">
          <span className="block text-[11px] text-slate-400 font-medium">Total</span>
          <span className="text-base sm:text-lg font-bold text-slate-900">
            ₹{lineTotal.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Remove Button */}
        <div>
          <button
            onClick={handleRemove}
            disabled={isBusy}
            aria-label="Remove item from cart"
            title="Remove item from cart"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isRemoving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        </div>

      </div>

    </div>
  )
}

export default CartItem
