import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: [true, 'Snapshot product name is required']
        },
        price: {
            type: Number,
            required: [true, 'Snapshot product price is required'],
            min: [0, 'Price cannot be negative']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },
        image: {
            type: String
        }
    },
    { _id: true }
)

const shippingAddressSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true
        },
        addressLine1: {
            type: String,
            required: [true, 'Address line is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            trim: true
        }
    },
    { _id: false }
)

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'User reference is required']
        },
        items: {
            type: [orderItemSchema],
            validate: {
                validator: function (items) {
                    return items && items.length > 0
                },
                message: 'An order must contain at least one item'
            }
        },
        shippingAddress: {
            type: shippingAddressSchema,
            required: [true, 'Shipping address is required']
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required'],
            min: [0, 'Total amount cannot be negative']
        },
        paymentStatus: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED'],
            default: 'PENDING'
        },
        status: {
            type: String,
            enum: ['PENDING_PAYMENT', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'],
            default: 'PENDING_PAYMENT'
        },
        razorpayOrderId: {
            type: String
        },
        razorpayPaymentId: {
            type: String
        },
        razorpaySignature: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model('Order', orderSchema)

export default Order
