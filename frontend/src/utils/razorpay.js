// Dynamically load Razorpay standard checkout script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if script is already present in document
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true

    script.onload = () => {
      resolve(true)
    }

    script.onerror = () => {
      console.warn('Failed to load external Razorpay checkout.js script')
      resolve(false)
    }

    document.body.appendChild(script)
  })
}
