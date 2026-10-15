import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import customerRoutes from './routes/customer.routes.js'
import productRoutes from './routes/product.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'

dotenv.config()
// Reloaded with Razorpay active configuration

const app = express()
const PORT = process.env.PORT || 8010

// Connect to MongoDB Atlas
if (process.env.dbUrl) {
    mongoose
        .connect(process.env.dbUrl)
        .then(() => {
            console.log('MongoDB Connected successfully')
        })
        .catch((err) => {
            console.error('MongoDB Connection Error:', err.message)
        })
} else {
    console.warn('Warning: dbUrl is not defined in .env. Please provide your MongoDB Atlas connection string.')
}

// Middlewares
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
]

if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ''))
}

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true)
            if (
                allowedOrigins.includes(origin) ||
                origin.endsWith('.vercel.app') ||
                process.env.NODE_ENV !== 'production'
            ) {
                return callback(null, true)
            }
            return callback(new Error(`CORS blocked for origin: ${origin}`))
        },
        credentials: true
    })
)

app.use(express.json())
app.use(cookieParser())

// Root / health-check route
app.get('/', (req, res) => {
    res.json({ message: 'ShopKart Authentication API is running', port: PORT })
})

// Routes
app.use('/customers', customerRoutes)
app.use('/products', productRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
