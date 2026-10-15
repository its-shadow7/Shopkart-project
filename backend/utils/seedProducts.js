import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Product from '../models/product.model.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const sampleProducts = [
    {
        name: 'Noise Cancelling Headphones',
        description: 'Premium wireless over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear acoustic fidelity.',
        price: 4999,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        stock: 25
    },
    {
        name: 'Mechanical RGB Keyboard',
        description: 'Tactile mechanical gaming keyboard with customizable RGB backlighting, detachable wrist rest, and durable blue switches.',
        price: 2999,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        stock: 12
    },
    {
        name: 'Ultra-Fast Wireless Mouse',
        description: 'Ergonomic wireless optical mouse with adjustable DPI up to 16000, ultra-low latency, and dual Bluetooth/2.4GHz connectivity.',
        price: 1499,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
        stock: 18
    },
    {
        name: 'Classic Vintage Denim Jacket',
        description: 'Timeless relaxed-fit denim jacket crafted from 100% heavyweight cotton with custom brass hardware.',
        price: 2499,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
        stock: 15
    },
    {
        name: 'Minimalist Leather Sneakers',
        description: 'Low-top handcrafted leather sneakers featuring cushioned memory-foam insoles and clean monochrome aesthetics.',
        price: 3499,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
        stock: 8
    },
    {
        name: 'The Pragmatic Programmer',
        description: 'Classic handbook for modern software engineers covering pragmatic architecture, code craft, and software mastery.',
        price: 1299,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        stock: 30
    },
    {
        name: 'Ceramic Pour-Over Coffee Maker',
        description: 'Artisanal ceramic dripper designed for slow, precise manual coffee brewing with optimal heat retention.',
        price: 899,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
        stock: 20
    },
    {
        name: 'Minimalist LED Desk Lamp',
        description: 'Sleek aluminum desk lamp featuring stepless dimming, touch controls, and 3 color temperature modes.',
        price: 1799,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
        stock: 14
    }
]

const seedDB = async () => {
    try {
        if (!process.env.dbUrl) {
            console.error('dbUrl not found in .env')
            process.exit(1)
        }

        await mongoose.connect(process.env.dbUrl)
        console.log('Connected to MongoDB for seeding...')

        const count = await Product.countDocuments()
        if (count === 0) {
            await Product.insertMany(sampleProducts)
            console.log(`Successfully seeded ${sampleProducts.length} products!`)
        } else {
            console.log(`Database already has ${count} products. Skipping seeding.`)
        }

        await mongoose.disconnect()
        console.log('Done.')
    } catch (error) {
        console.error('Seeding error:', error)
        process.exit(1)
    }
}

seedDB()
