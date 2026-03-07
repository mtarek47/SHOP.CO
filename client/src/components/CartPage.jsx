import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import './CartPage.css'

const DISCOUNT_RATE = 0.20
const DELIVERY_FEE = 15

const CartPage = ({ onNavigateHome, onCheckout }) => {
  const { items, removeItem, updateQty, subtotal } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const discountAmount = Math.round(subtotal * DISCOUNT_RATE)
  const total = subtotal - discountAmount + DELIVERY_FEE

  const handleApplyPromo = () => {
    if (promoCode.trim()) setPromoApplied(true)
  }

  return (
    <div className="cart-page">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <a href="#" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); onNavigateHome() }}>Home</a>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">Cart</span>
        </nav>

        <h1 className="cart-title">YOUR CART</h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p className="cart-empty-text">Your cart is empty</p>
            <button className="cart-empty-btn" onClick={onNavigateHome}>Continue Shopping</button>
          </div>
        ) : (
          <div className="cart-layout">

            {/* ── Cart Items ── */}
            <div className="cart-items-wrap">
              {items.map((item, idx) => (
                <React.Fragment key={item.cartId}>
                  <div className="cart-item">
                    {/* Product image */}
                    <div className="cart-item-img-wrap">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                    </div>

                    {/* Product info */}
                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <button
                          className="cart-item-remove"
                          onClick={() => removeItem(item.cartId)}
                          aria-label="Remove item"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#FF3333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>

                      <p className="cart-item-meta">Size: {item.size}</p>
                      <p className="cart-item-meta">Color: {item.color}</p>

                      <div className="cart-item-bottom">
                        <span className="cart-item-price">BDT{item.price * item.qty}</span>
                        <div className="cart-item-qty">
                          <button
                            className="qty-btn"
                            onClick={() => updateQty(item.cartId, item.qty - 1)}
                            aria-label="Decrease"
                          >−</button>
                          <span className="qty-val">{item.qty}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQty(item.cartId, item.qty + 1)}
                            aria-label="Increase"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {idx < items.length - 1 && <hr className="cart-item-divider" />}
                </React.Fragment>
              ))}
            </div>

            {/* ── Order Summary ── */}
            <div className="order-summary">
              <h2 className="order-summary-title">Order Summary</h2>

              <div className="order-summary-rows">
                <div className="order-row">
                  <span className="order-row-label">Subtotal</span>
                  <span className="order-row-value">BDT{subtotal}</span>
                </div>
                <div className="order-row">
                  <span className="order-row-label">Discount (-20%)</span>
                  <span className="order-row-value order-row-discount">BDT{-discountAmount}</span>
                </div>
                <div className="order-row">
                  <span className="order-row-label">Delivery Fee</span>
                  <span className="order-row-value">BDT{DELIVERY_FEE}</span>
                </div>
              </div>

              <hr className="order-divider" />

              <div className="order-row order-total-row">
                <span className="order-total-label">Total</span>
                <span className="order-total-value">BDT{total}</span>
              </div>

              {/* Promo code */}
              <div className="promo-row">
                <div className="promo-input-wrap">
                  <svg className="promo-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Add promo code"
                    className="promo-input"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                </div>
                <button className="promo-apply-btn" onClick={handleApplyPromo}>
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="promo-success">✓ Promo code applied!</p>
              )}

              {/* Checkout button */}
              <button className="checkout-btn" onClick={onCheckout}>
                Go to Checkout
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
