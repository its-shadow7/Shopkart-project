import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  })
  const [loader, setLoader] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errorMsg) setErrorMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validations
    if (!form.fullName.trim() || !form.email.trim() || !form.password || !form.phone.trim()) {
      setErrorMsg('Please fill in all fields.')
      return
    }

    if (form.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    setLoader(true)
    setErrorMsg('')

    try {
      await api.post('/customers/register', {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
      })

      // On success -> redirect to Login page
      navigate('/login')
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 'Registration failed. Please try again.'
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
            Join ShopKart
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create an account to start shopping seamlessly.
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600 border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              disabled={loader}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 text-sm placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50"
            />
          </div>

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

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="9876543210"
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
              {loader ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
