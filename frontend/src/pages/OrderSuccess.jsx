import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { api } from '../services/api'
import Navbar from '../components/Navbar'

function OrderSuccess() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!order)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!order) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`)
          setOrder(res.data.order)
        } catch (err) {
          console.error('Failed to load order details:', err)
          setError(err.response?.data?.message || 'Could not retrieve order details')
        } finally {
          setLoading(false)
        }
      }
      fetchOrder()
    }
  }, [id, order])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        {loading && (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-slate-700">Loading order confirmation...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-white p-12 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 text-xl font-bold">
              ✕
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">{error}</h3>
            <Link
              to="/orders"
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Go to My Orders
            </Link>
          </div>
        )}

        {!loading && !error && order && (
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            
            {/* Celebration Header */}
            <div className="bg-gradient-to-b from-emerald-50/70 to-white p-8 sm:p-10 text-center border-b border-slate-100">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 text-4xl shadow-sm">
                ✓
              </div>
              <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Order Placed Successfully!
              </h1>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                Thank you for your purchase. Your payment was verified and your order is now confirmed.
              </p>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700 border border-emerald-200/80">
                  Status: {order.status}
                </span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 font-bold text-indigo-700 border border-indigo-200/80">
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Order Details Body */}
            <div className="p-6 sm:p-10 space-y-8">
              
              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl bg-slate-50 p-4 sm:p-5 border border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Order ID</span>
                  <span className="font-mono font-bold text-slate-800 break-all">{order._id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Order Date</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Total Paid</span>
                  <span className="font-black text-slate-900 text-sm">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Delivery Destination */}
              {order.shippingAddress && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Shipping Address
                  </h3>
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs space-y-1 text-slate-600">
                    <p className="font-bold text-slate-800 text-sm">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                    </p>
                    <p className="text-slate-400 pt-1">Phone: {order.shippingAddress.phone}</p>
                  </div>
                </div>
              )}

              {/* Items Purchased Snapshot */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Purchased Items Snapshot ({order.items?.length})
                </h3>
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
                  {order.items?.map((item) => (
                    <div key={item._id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs text-slate-400">
                            Unit Price: ₹{item.price?.toLocaleString('en-IN')} × {item.quantity} units
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900 shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100">
                <Link
                  to="/orders"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all cursor-pointer"
                >
                  View My Orders →
                </Link>

                <Link
                  to="/products"
                  className="w-full sm:w-auto flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Continue Shopping
                </Link>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default OrderSuccess
