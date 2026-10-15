import mongoose from 'mongoose'
import Product from '../models/product.model.js'

// @desc    Create a new product
// @route   POST /products
// @access  Public
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body

        // Validate all mandatory fields
        if (!name || !description || price === undefined || !category || !image || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, description, price, category, image, stock) are required'
            })
        }

        const numPrice = Number(price)
        const numStock = Number(stock)

        // Validate price
        if (isNaN(numPrice) || numPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be a valid number greater than 0'
            })
        }

        // Validate stock
        if (isNaN(numStock) || numStock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock must be a valid number greater than or equal to 0'
            })
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: numPrice,
            category: category.trim(),
            image: image.trim(),
            stock: numStock
        })

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        })
    } catch (error) {
        console.error('Create Product Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

// @desc    Get all products with search & category filtering (+ optional price sorting and pagination)
// @route   GET /products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query

        // Pagination parameters
        const page = Math.max(1, parseInt(req.query.page, 10) || 1)
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 8)
        const skip = (page - 1) * limit

        // Dynamically build filter query
        const query = {}

        // Case-insensitive search on product name
        if (search && search.trim() !== '') {
            query.name = { $regex: search.trim(), $options: 'i' }
        }

        // Category filter (ignore 'All' or empty values)
        if (category && category.trim() !== '' && category.trim().toLowerCase() !== 'all') {
            query.category = { $regex: `^${category.trim()}$`, $options: 'i' }
        }

        // Sorting (Bonus Challenge)
        let sortOption = { createdAt: -1 } // default newest first
        if (sort === 'price_asc') {
            sortOption = { price: 1 }
        } else if (sort === 'price_desc') {
            sortOption = { price: -1 }
        }

        // Total matching items
        const total = await Product.countDocuments(query)
        const totalPages = Math.ceil(total / limit) || 1

        const products = await Product.find(query)
            .select('name price category image stock')
            .sort(sortOption)
            .skip(skip)
            .limit(limit)

        return res.status(200).json({
            success: true,
            count: products.length,
            total,
            page,
            totalPages,
            limit,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            products
        })
    } catch (error) {
        console.error('Get Products Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

// @desc    Get single product by ID
// @route   GET /products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        return res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        console.error('Get Product By ID Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}
