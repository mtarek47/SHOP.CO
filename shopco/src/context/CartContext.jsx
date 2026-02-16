import React, { createContext, useContext, useState } from 'react'
import { allProducts } from '../data/productsData'

const CartContext = createContext(null)

// Pre-populate cart with 3 items matching the design
const defaultItems = [
  {
    cartId: 'cart-casual-1',
    productId: 'casual-1',
    name: 'Gradient Graphic T-shirt',
    image: 'https://placehold.co/100x100/f2f0f1/333?text=Tshirt',
    size: 'Large',
    color: 'White',
    price: 145,
    qty: 1,
  },
  {
    cartId: 'cart-casual-5',
    productId: 'casual-5',
    name: 'Checkered Shirt',
    image: 'https://placehold.co/100x100/f2f0f1/333?text=Shirt',
    size: 'Medium',
    color: 'Red',
    price: 180,
    qty: 1,
  },
  {
    cartId: 'cart-casual-4',
    productId: 'casual-4',
    name: 'Skinny Fit Jeans',
    image: 'https://placehold.co/100x100/f2f0f1/333?text=Jeans',
    size: 'Large',
    color: 'Blue',
    price: 240,
    qty: 1,
  },
]

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(defaultItems)

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
