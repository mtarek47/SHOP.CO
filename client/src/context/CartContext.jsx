import React, { createContext, useContext, useState, useEffect } from 'react'
import { allProducts } from '../data/productsData'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product, size, colorHex, colorName) => {
    const cartId = `cart-${product.id}-${size}-${colorHex}`
    setItems((prev) => {
      const existing = prev.find((i) => i.cartId === cartId)
      if (existing) {
        return prev.map((i) => i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, {
        cartId,
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || product.image,
        size,
        color: colorName || 'Default',
        price: product.price,
        qty: 1,
      }]
    })
  }

  const removeItem = (cartId) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId))
  }

  const updateQty = (cartId, qty) => {
    if (qty < 1) return removeItem(cartId)
    setItems((prev) => prev.map((i) => i.cartId === cartId ? { ...i, qty } : i))
  }

  const clearCart = () => setItems([])

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeItem, updateQty, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
