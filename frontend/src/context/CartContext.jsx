import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { api } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // Per-item loading dictionary: { [productId]: 'adding' | 'updating' | 'removing' }
  const [itemActionState, setItemActionState] = useState({})

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/cart')
      setCart(response.data.cart || [])
    } catch (err) {
      console.error('Failed to load cart:', err)
      setError(err.response?.data?.message || 'Failed to load shopping cart')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Automatically fetch on mount or when authenticated user changes
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Derived Values (Single Source of Truth - Computed from cart state)
  // 1. Total units (e.g. Keyboard x 2 + Mouse x 1 = 3)
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0)
  }, [cart])

  // 2. Subtotal (Σ product.price * quantity)
  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.product?.price || 0
      const qty = item.quantity || 0
      return total + price * qty
    }, 0)
  }, [cart])

  // 3. Distinct product count
  const distinctItemCount = cart.length

  // Add Product to Cart (POST /cart/:productId)
  const addToCart = async (productId) => {
    if (!user) {
      return { success: false, message: 'Please log in to add products to your cart' }
    }

    setItemActionState((prev) => ({ ...prev, [productId]: 'adding' }))
    try {
      const response = await api.post(`/cart/${productId}`)
      if (response.data.success && response.data.cart) {
        setCart(response.data.cart)
      } else {
        await fetchCart()
      }
      return {
        success: true,
        message: response.data.message || 'Product added to cart',
        cart: response.data.cart
      }
    } catch (err) {
      console.error('Add to cart error:', err)
      const message = err.response?.data?.message || 'Failed to add product to cart'
      return { success: false, message }
    } finally {
      setItemActionState((prev) => {
        const next = { ...prev }
        delete next[productId]
        return next
      })
    }
  }

  // Update Item Quantity in Cart (PATCH /cart/:productId)
  const updateQuantity = async (productId, newQuantity) => {
    if (!user) {
      return { success: false, message: 'Please log in to manage your cart' }
    }

    if (newQuantity < 1) {
      return removeFromCart(productId)
    }

    setItemActionState((prev) => ({ ...prev, [productId]: 'updating' }))
    try {
      const response = await api.patch(`/cart/${productId}`, { quantity: newQuantity })
      if (response.data.success && response.data.cart) {
        setCart(response.data.cart)
      } else {
        await fetchCart()
      }
      return {
        success: true,
        message: response.data.message || 'Cart updated',
        cart: response.data.cart
      }
    } catch (err) {
      console.error('Update quantity error:', err)
      const message = err.response?.data?.message || 'Failed to update quantity'
      return { success: false, message }
    } finally {
      setItemActionState((prev) => {
        const next = { ...prev }
        delete next[productId]
        return next
      })
    }
  }

  // Remove Item from Cart (DELETE /cart/:productId)
  const removeFromCart = async (productId) => {
    if (!user) {
      return { success: false, message: 'Please log in to manage your cart' }
    }

    setItemActionState((prev) => ({ ...prev, [productId]: 'removing' }))
    try {
      const response = await api.delete(`/cart/${productId}`)
      if (response.data.success && response.data.cart) {
        setCart(response.data.cart)
      } else {
        await fetchCart()
      }
      return {
        success: true,
        message: response.data.message || 'Product removed from cart',
        cart: response.data.cart
      }
    } catch (err) {
      console.error('Remove from cart error:', err)
      const message = err.response?.data?.message || 'Failed to remove product from cart'
      return { success: false, message }
    } finally {
      setItemActionState((prev) => {
        const next = { ...prev }
        delete next[productId]
        return next
      })
    }
  }

  // Clear entire cart (DELETE /cart)
  const clearCart = async () => {
    if (!user) return
    setLoading(true)
    try {
      await api.delete('/cart')
      setCart([])
      return { success: true, message: 'Cart cleared' }
    } catch (err) {
      console.error('Clear cart error:', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to clear cart'
      }
    } finally {
      setLoading(false)
    }
  }

  // Query helpers
  const isInCart = useCallback(
    (productId) => {
      return cart.some((item) => item.product?._id === productId)
    },
    [cart]
  )

  const getItemQuantity = useCallback(
    (productId) => {
      const item = cart.find((item) => item.product?._id === productId)
      return item ? item.quantity : 0
    },
    [cart]
  )

  const value = {
    cart,
    cartCount,
    cartSubtotal,
    distinctItemCount,
    loading,
    error,
    itemActionState,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
    isInCart,
    getItemQuantity
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
