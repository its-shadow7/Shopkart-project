import express from 'express'
import {
    createPaymentOrder,
    verifyPayment,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} from '../controllers/order.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const router = express.Router()

// All order endpoints are protected by JWT authentication
router.use(isAuthenticated)

// Payment & Order Creation
router.post('/create-payment-order', createPaymentOrder)
router.post('/verify-payment', verifyPayment)

// Order History & Single Order Queries
router.get('/', getMyOrders)
router.get('/:id', getOrderById)

// Bonus Challenge: Order Status Progression
router.patch('/:id/status', updateOrderStatus)

export default router
