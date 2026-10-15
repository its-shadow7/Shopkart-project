import mongoose from 'mongoose'
import Customer from '../models/customer.model.js'
import Product from '../models/product.model.js'

// @desc    Add product to wishlist
// @route   POST /wishlist/:productId
// @access  Protected
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        // 1. Validate Product ID format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }

        // 2. Validate Product exists in database
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        // 3. Find authenticated customer
        const customer = await Customer.findById(req.user._id)
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }

        // 4. Check for duplicates in wishlist
        const alreadyWishlisted = customer.wishlist.some(
            (id) => id.toString() === productId
        )

        if (alreadyWishlisted) {
            return res.status(409).json({
                success: false,
                message: 'Product already in wishlist'
            })
        }

        // 5. Add product reference and persist
        customer.wishlist.push(productId)
        await customer.save()

        return res.status(201).json({
            success: true,
            message: 'Product added to wishlist'
        })
    } catch (error) {
        console.error('Add To Wishlist Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

// @desc    Get current user's wishlist (populated)
// @route   GET /wishlist
// @access  Protected
export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: 'wishlist',
            select: 'name price category image stock description'
        })

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }

        // Filter out null references if a product was deleted from DB
        const validWishlist = (customer.wishlist || []).filter((item) => item !== null)

        return res.status(200).json({
            success: true,
            count: validWishlist.length,
            wishlist: validWishlist
        })
    } catch (error) {
        console.error('Get Wishlist Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

// @desc    Remove product from wishlist
// @route   DELETE /wishlist/:productId
// @access  Protected
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        // 1. Validate Product ID format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }

        // 2. Find authenticated customer
        const customer = await Customer.findById(req.user._id)
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }

        // 3. Verify product is currently in wishlist
        const isInWishlist = customer.wishlist.some(
            (id) => id.toString() === productId
        )

        if (!isInWishlist) {
            return res.status(404).json({
                success: false,
                message: 'Product not in wishlist'
            })
        }

        // 4. Remove reference and save
        customer.wishlist = customer.wishlist.filter(
            (id) => id.toString() !== productId
        )
        await customer.save()

        return res.status(200).json({
            success: true,
            message: 'Product removed from wishlist'
        })
    } catch (error) {
        console.error('Remove From Wishlist Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

// @desc    Toggle product in wishlist (Bonus Challenge)
// @route   PATCH /wishlist/:productId/toggle
// @access  Protected
export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        const customer = await Customer.findById(req.user._id)
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }

        const index = customer.wishlist.findIndex(
            (id) => id.toString() === productId
        )

        if (index > -1) {
            // Remove
            customer.wishlist.splice(index, 1)
            await customer.save()
            return res.status(200).json({
                success: true,
                isWishlisted: false,
                message: 'Product removed from wishlist'
            })
        } else {
            // Add
            customer.wishlist.push(productId)
            await customer.save()
            return res.status(200).json({
                success: true,
                isWishlisted: true,
                message: 'Product added to wishlist'
            })
        }
    } catch (error) {
        console.error('Toggle Wishlist Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}
