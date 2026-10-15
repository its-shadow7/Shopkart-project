import express from 'express'
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    toggleWishlist
} from '../controllers/wishlist.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const router = express.Router()

// All wishlist routes are protected
router.use(isAuthenticated)

// Standard CRUD endpoints
router.get('/', getWishlist)
router.post('/:productId', addToWishlist)
router.delete('/:productId', removeFromWishlist)

// Bonus toggle endpoint
router.patch('/:productId/toggle', toggleWishlist)

export default router
