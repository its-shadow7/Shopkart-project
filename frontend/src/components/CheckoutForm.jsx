function CheckoutForm({ formData, setFormData, errors, disabled }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
          📍
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Delivery Address</h2>
          <p className="text-xs text-slate-400">Where should we deliver your order?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={disabled}
            placeholder="e.g. Aarav Sharma"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-4 ${
              errors.fullName
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10'
                : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-indigo-500/10'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.fullName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={disabled}
            placeholder="10-digit mobile number (e.g. 9876543210)"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-4 ${
              errors.phone
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10'
                : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-indigo-500/10'
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.phone}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Street Address / House No. <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            disabled={disabled}
            placeholder="e.g. 22 MG Road, Indiranagar"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-4 ${
              errors.addressLine1
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10'
                : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-indigo-500/10'
            }`}
          />
          {errors.addressLine1 && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.addressLine1}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            City <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={disabled}
            placeholder="e.g. Bengaluru"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-4 ${
              errors.city
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10'
                : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-indigo-500/10'
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.city}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            State <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled={disabled}
            placeholder="e.g. Karnataka"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-4 ${
              errors.state
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10'
                : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-indigo-500/10'
            }`}
          />
          {errors.state && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.state}</p>
          )}
        </div>

        {/* Pincode */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            PIN Code (6 digits) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            disabled={disabled}
            placeholder="e.g. 560001"
            maxLength={6}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-4 ${
              errors.pincode
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10'
                : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-indigo-500/10'
            }`}
          />
          {errors.pincode && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.pincode}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm
