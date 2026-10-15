import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loader, setLoader] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { setUser, fetchUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errorMsg) setErrorMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validations
    if (!form.email.trim() || !form.password) {
      setErrorMsg('Please fill in both email and password.')
      return
    }

    setLoader(true)
    setErrorMsg('')

    try {
      const response = await api.post('/customers/login', {
        email: form.email.trim(),
        password: form.password,
      })

      // Backend returns customer data or fetch from /customers/me
      if (response.data.customer) {
        setUser(response.data.customer)
      } else {
        await fetchUser()
      }

      // On success -> navigate to /products
      navigate('/products')
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 'Invalid Credentials'
      )
    } finally {
      setLoader(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
        
        {/* Branding & Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-xl shadow-lg shadow-indigo-200">
            sk
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Log in to ShopKart
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your credentials to access your customer portal.
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600 border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@gmail.com"
              disabled={loader}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loader}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loader}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loader ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
