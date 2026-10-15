import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import Navbar from '../components/Navbar'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/orders')
      setOrders(response.data.orders || [])
    } catch (err) {
      console.error('Failed to load orders:', err)
      setError(err.response?.data?.message || 'Failed to retrieve order history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'SHIPPED':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                My Orders
              </h1>
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 text-sm font-bold shadow-2xs">
                📦
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Track, view snapshots, and review your past purchases.
            </p>
          </div>

          {!loading && !error && orders.length > 0 && (
            <span className="text-xs font-semibold text-slate-400 self-start sm:self-auto">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
            </span>
          )}
        </div>

        {/* 1. Loading State */}
        {loading && (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-slate-700">Loading your orders...</p>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-rose-100 bg-white p-12 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 text-xl font-bold">
              ✕
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Unable to load orders</h3>
            <p className="mt-1 text-xs text-slate-500">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-xs">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-4xl shadow-inner">
              📦
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">
              You have not placed any orders yet.
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm">
              When you complete checkout and payment, your verified orders and purchase snapshots will appear here.
            </p>
            <Link
              to="/products"
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all cursor-pointer"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* 4. Populated Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xs transition-all hover:border-slate-200"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50/70 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Order Placed
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="hidden sm:block h-6 w-px bg-slate-200" />

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Total
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="hidden sm:block h-6 w-px bg-slate-200" />

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Order #
                      </span>
                      <span className="font-mono text-xs text-slate-600">
                        {order._id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="divide-y divide-slate-100">
                    {order.items?.map((item) => (
                      <div key={item._id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-14 w-14 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs sm:text-sm font-bold text-slate-800 shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-slate-400 truncate max-w-sm">
                      Deliver to: <span className="font-medium text-slate-700">{order.shippingAddress?.fullName}</span> ({order.shippingAddress?.city})
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

export default Orders
