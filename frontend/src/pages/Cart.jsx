import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'
import CartItem from '../components/CartItem'

function Cart() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    distinctItemCount,
    loading,
    error,
    refreshCart,
    clearCart
  } = useCart()

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false)
  const [clearing, setClearing] = useState(false)

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      setClearing(true)
      await clearCart()
      setClearing(false)
    }
  }

  // Shipping calculation (e.g. Free delivery for subtotal >= 999)
  const freeShippingThreshold = 999
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0
  const shippingFee = isFreeShipping ? 0 : 99
  const orderTotal = cartSubtotal + shippingFee

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </Link>

          {!loading && !error && cart.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={clearing}
              className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {clearing ? 'Clearing...' : 'Clear Entire Cart'}
            </button>
          )}
        </div>

        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                My Cart
              </h1>
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 text-sm font-bold shadow-2xs">
                🛒
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Review your items, adjust quantities, and proceed to checkout.
            </p>
          </div>

          {!loading && !error && cart.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="rounded-xl bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
                {cartCount} {cartCount === 1 ? 'total unit' : 'total units'}
              </span>
              <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {distinctItemCount} {distinctItemCount === 1 ? 'product' : 'products'}
              </span>
            </div>
          )}
        </div>

        {/* 1. Loading State */}
        {loading && (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading your cart...
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Retrieving persistent server data and verifying stock
            </p>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-white p-12 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
              Unable to load your cart.
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              {error || 'Something went wrong while communicating with the server.'}
            </p>
            <button
              onClick={refreshCart}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && cart.length === 0 && (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-4xl shadow-inner">
              🛒
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Your cart is empty 🛒
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm">
              Looks like you haven't added anything yet. Explore our curated catalog of products and discover great deals.
            </p>
            <Link
              to="/products"
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all cursor-pointer"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* 4. Populated Cart View (Grid with Items + Order Summary) */}
        {!loading && !error && cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <CartItem key={item.product?._id || item._id} item={item} />
              ))}

              {/* Free delivery notice bar */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚚</span>
                  <span className="font-semibold text-indigo-900">
                    {isFreeShipping
                      ? 'Congratulations! You qualified for Free Shipping.'
                      : `Add ₹${(freeShippingThreshold - cartSubtotal).toLocaleString('en-IN')} more to unlock Free Standard Shipping!`}
                  </span>
                </div>
                {!isFreeShipping && (
                  <Link to="/products" className="font-bold text-indigo-600 hover:underline">
                    Add Items
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Distinct Products</span>
                    <span className="font-semibold text-slate-900">{distinctItemCount}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Total Quantity</span>
                    <span className="font-semibold text-slate-900">{cartCount} units</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Estimate</span>
                    {isFreeShipping ? (
                      <span className="font-semibold text-emerald-600">FREE</span>
                    ) : (
                      <span className="font-semibold text-slate-900">₹{shippingFee}</span>
                    )}
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span className="font-semibold text-emerald-600">Included</span>
                  </div>

                  {/* Total separator */}
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900">
                        ₹{orderTotal.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        (Derived from state • Single Source of Truth)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98] cursor-pointer"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Proceed to Checkout
                </Link>

                {/* Assurance points */}
                <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>100% Genuine Products guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>7-Day Return / Exchange Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Persistent across sessions & page refreshes</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Modal previewing Lab 06 Checkout flow */}
        {checkoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-3xl">
                🚀
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Ready for Checkout!
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Your cart containing <strong>{cartCount} items</strong> worth <strong>₹{orderTotal.toLocaleString('en-IN')}</strong> is safely persisted in MongoDB.
              </p>
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-200 text-left">
                <strong>What comes next in Lab-06:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-500">
                  <li>Shipping address selection</li>
                  <li>Final stock verification lock</li>
                  <li>Order snapshot creation</li>
                  <li>Cart-to-Order conversion</li>
                </ul>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
              >
                Got It, Return to Cart
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Cart
