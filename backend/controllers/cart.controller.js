import mongoose from 'mongoose'
import Customer from '../models/customer.model.js'
import Product from '../models/product.model.js'

// @desc    Add product to cart or increment quantity if already present
// @route   POST /cart/:productId
// @access  Protected
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params

        // 1. Validate Product ID format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }

        // 2. Validate Product exists in DB and fetch current stock
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

        // Initialize cart array if undefined
        if (!customer.cart) {
            customer.cart = []
        }

        // 4. Check if product already exists in customer's cart
        const cartItemIndex = customer.cart.findIndex(
            (item) => item.product && item.product.toString() === productId
        )

        if (cartItemIndex > -1) {
            // Product already exists in cart -> increment quantity
            const currentQuantity = customer.cart[cartItemIndex].quantity
            const targetQuantity = currentQuantity + 1

            // Stock validation
            if (targetQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot add more units. Stock limit reached (only ${product.stock} available)`
                })
            }

            customer.cart[cartItemIndex].quantity = targetQuantity
        } else {
            // Product is not yet in cart -> add with quantity = 1
            if (product.stock < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Product is currently out of stock'
                })
            }

            customer.cart.push({
                product: productId,
                quantity: 1
            })
        }

        // 5. Persist to MongoDB
        await customer.save()

        // 6. Populate product details to return fully enriched cart
        await customer.populate({
            path: 'cart.product',
            select: 'name price category image stock description'
        })

        const validCart = customer.cart.filter((item) => item.product !== null)

        return res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart: validCart
        })
    } catch (error) {
        console.error('Add To Cart Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

// @desc    Get current user's cart (populated with product info)
// @route   GET /cart
// @access  Protected
export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: 'cart.product',
            select: 'name price category image stock description'
        })

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }

        // Filter out null references if a product was deleted from DB
        const validCart = (customer.cart || []).filter((item) => item.product !== null)

        return res.status(200).json({
            success: true,
            cart: validCart
        })
    } catch (error) {
        console.error('Get Cart Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

// @desc    Update product quantity in cart
// @route   PATCH /cart/:productId
// @access  Protected
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params
        const { quantity } = req.body

        // 1. Validate Product ID format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }

        // 2. Validate Quantity
        const parsedQuantity = Number(quantity)
        if (
            quantity === undefined ||
            quantity === null ||
            isNaN(parsedQuantity) ||
            !Number.isInteger(parsedQuantity) ||
            parsedQuantity < 1
        ) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be a valid integer of at least 1'
            })
        }

        // 3. Find Product in DB to verify existence and stock
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        // 4. Stock validation
        if (parsedQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Requested quantity exceeds available stock (${product.stock} available)`
            })
        }

        // 5. Find authenticated customer
        const customer = await Customer.findById(req.user._id)
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }

        // 6. Find item in cart
        const cartItem = (customer.cart || []).find(
            (item) => item.product && item.product.toString() === productId
        )

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Product not in cart'
            })
        }

        // 7. Update quantity & persist
        cartItem.quantity = parsedQuantity
        await customer.save()

        // 8. Populate & return updated cart
        await customer.populate({
            path: 'cart.product',
            select: 'name price category image stock description'
        })

        const validCart = customer.cart.filter((item) => item.product !== null)

        return res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart: validCart
        })
    } catch (error) {
        console.error('Update Cart Quantity Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

// @desc    Remove product from cart
// @route   DELETE /cart/:productId
// @access  Protected
export const removeFromCart = async (req, res) => {
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

        // 3. Verify product is in cart
        const itemExists = (customer.cart || []).some(
            (item) => item.product && item.product.toString() === productId
        )

        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: 'Product not in cart'
            })
        }

        // 4. Remove item from cart and save
        customer.cart = customer.cart.filter(
            (item) => item.product && item.product.toString() !== productId
        )
        await customer.save()

        // 5. Populate remaining items & return
        await customer.populate({
            path: 'cart.product',
            select: 'name price category image stock description'
        })

        const validCart = customer.cart.filter((item) => item.product !== null)

        return res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart: validCart
        })
    } catch (error) {
        console.error('Remove From Cart Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

// @desc    Clear entire cart
// @route   DELETE /cart
// @access  Protected
export const clearCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }

        customer.cart = []
        await customer.save()

        return res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            cart: []
        })
    } catch (error) {
        console.error('Clear Cart Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}
