import express from 'express'
import {
    registerCustomer,
    loginCustomer,
    getCustomerProfile,
    logoutCustomer,
    changePassword
} from '../controllers/customer.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Public Routes
router.post('/register', registerCustomer)
router.post('/login', loginCustomer)

// Protected Routes
router.get('/me', isAuthenticated, getCustomerProfile)
router.post('/logout', isAuthenticated, logoutCustomer)
router.patch('/change-password', isAuthenticated, changePassword)

export default router