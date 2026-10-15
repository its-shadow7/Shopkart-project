import express from 'express'
import {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
} from '../controllers/cart.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const router = express.Router()

// All cart routes are protected
router.use(isAuthenticated)

// Standard CRUD Cart endpoints per Lab-05 API Contract
router.get('/', getCart)
router.post('/:productId', addToCart)
router.patch('/:productId', updateCartQuantity)
router.delete('/:productId', removeFromCart)

// Helper: Clear entire cart
router.delete('/', clearCart)

export default router
