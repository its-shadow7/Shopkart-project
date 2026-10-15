import Razorpay from 'razorpay'
import dotenv from 'dotenv'

dotenv.config()

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TntOd7OFkfn5ZJ',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'gxL4FzjxzPSVTySD6bfUh3Qn'
})

export default razorpay
