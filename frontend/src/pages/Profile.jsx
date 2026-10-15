import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

function Profile() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Profile Card */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-2xl shadow-lg shadow-indigo-200">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {user?.fullName || 'Customer Profile'}
                  </h1>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                    Active Account
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  ShopKart Customer Account & Session Details
                </p>
              </div>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors self-start sm:self-auto"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Go to Store
            </Link>
          </div>

          {/* Customer Details Grid */}
          <div className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="block text-xs font-medium text-slate-400">Full Name</span>
                <span className="mt-1 block text-sm font-semibold text-slate-800">
                  {user?.fullName || '—'}
                </span>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="block text-xs font-medium text-slate-400">Email Address</span>
                <span className="mt-1 block text-sm font-semibold text-slate-800">
                  {user?.email || '—'}
                </span>
              </div>

              {/* Phone */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="block text-xs font-medium text-slate-400">Phone Number</span>
                <span className="mt-1 block text-sm font-semibold text-slate-800">
                  {user?.phone || '—'}
                </span>
              </div>

              {/* Customer ID */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="block text-xs font-medium text-slate-400">Customer ID</span>
                <span className="mt-1 block text-xs font-mono font-medium text-slate-600 truncate">
                  {user?._id || '—'}
                </span>
              </div>

            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Explore Product Catalog</h3>
              <p className="text-xs text-slate-500">Discover electronics, fashion, books, and home essentials.</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all cursor-pointer"
            >
              Browse Products
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

        </div>

      </main>
    </div>
  )
}

export default Profile
