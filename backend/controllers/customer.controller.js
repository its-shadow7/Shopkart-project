import Customer from '../models/customer.model.js'
import bcrypt from 'bcrypt'
import { genToken } from '../utils/generateToken.js'

const isProduction = process.env.NODE_ENV === 'production'

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

// @desc    Register a new customer
// @route   POST /customers/register
// @access  Public
export const registerCustomer = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body

        // Validate all required fields
        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' })
        }

        const normalizedEmail = email.trim().toLowerCase()

        // Check if customer email already exists
        const existingCustomer = await Customer.findOne({ email: normalizedEmail })
        if (existingCustomer) {
            return res.status(409).json({ message: 'Customer already exists with this email' })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new customer
        const customer = await Customer.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone: phone.trim()
        })

        res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            customer: {
                _id: customer._id,
                fullName: customer.fullName,
                email: customer.email,
                phone: customer.phone
            }
        })
    } catch (error) {
        console.error('Register Error:', error)
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
}

// @desc    Authenticate customer & set cookie
// @route   POST /customers/login
// @access  Public
export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const customer = await Customer.findOne({ email: email.trim().toLowerCase() })

        // Failure case: do not reveal whether email or password was wrong
        if (!customer) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isPasswordMatch = await bcrypt.compare(password, customer.password)
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Generate JWT token
        const token = genToken(customer._id)

        // Store JWT inside HttpOnly cookie
        res.cookie('token', token, cookieOptions)

        res.status(200).json({
            success: true,
            message: 'Login successful',
            customer: {
                _id: customer._id,
                fullName: customer.fullName,
                email: customer.email,
                phone: customer.phone
            }
        })
    } catch (error) {
        console.error('Login Error:', error)
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
}

// @desc    Get currently authenticated customer profile
// @route   GET /customers/me
// @access  Private
export const getCustomerProfile = async (req, res) => {
    try {
        res.status(200).json({
            _id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            phone: req.user.phone
        })
    } catch (error) {
        console.error('Get Profile Error:', error)
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
}

// @desc    Log out customer & clear cookie
// @route   POST /customers/logout
// @access  Private
export const logoutCustomer = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        })

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.error('Logout Error:', error)
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
}

// @desc    Change customer password (Bonus Challenge)
// @route   PATCH /customers/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Both old and new passwords are required' })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' })
        }

        // Fetch customer with password to verify
        const customer = await Customer.findById(req.user._id)
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' })
        }

        const isMatch = await bcrypt.compare(oldPassword, customer.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password does not match' })
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10)
        customer.password = await bcrypt.hash(newPassword, salt)
        await customer.save()

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        })
    } catch (error) {
        console.error('Change Password Error:', error)
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
}
