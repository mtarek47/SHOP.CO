import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { paymentConfig } from '../config/paymentConfig'
import './CartPage.css'

const DISCOUNT_RATE = 0.20
const DELIVERY_FEE = 15

const CartPage = ({ onNavigateHome }) => {
  const { items, removeItem, updateQty, subtotal } = useCart()
  const { user } = useAuth()
  
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  
  // Checkout State
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('Bangladesh')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState(() => {
    const activeKeys = Object.keys(paymentConfig.activeMethods).filter(
      k => paymentConfig.activeMethods[k]
    )
    return activeKeys.includes('stripe') ? 'stripe' : activeKeys[0] || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Order History state
  const [myOrders, setMyOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  const loadMyOrders = async () => {
    setLoadingOrders(true)
    try {
      const res = await fetch('http://localhost:5000/api/orders/myorders', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setMyOrders(data)
      }
    } catch (err) {
      console.error('Failed to load user orders:', err)
    } finally {
      setLoadingOrders(false)
    }
  }

  // Pre-fill email and load past orders
  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email)
      loadMyOrders()
    } else {
      setMyOrders([])
    }
  }, [user])

  const discountAmount = Math.round(subtotal * DISCOUNT_RATE)
  const total = subtotal - discountAmount + DELIVERY_FEE

  const handleApplyPromo = () => {
    if (promoCode.trim()) setPromoApplied(true)
  }

  const handlePayExistingOrder = async (orderId, orderPaymentMethod) => {
    try {
      const res = await fetch(`http://localhost:5000/api/payments/${orderId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ paymentMethod: orderPaymentMethod })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || 'Payment initiation failed');
      }
    } catch (err) {
      alert('Failed to reach backend server');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        alert('Order cancelled successfully');
        loadMyOrders();
      } else {
        alert(data.message || 'Cancellation failed');
      }
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Please login to checkout.')
      return
    }
    if (!address || !city || !postalCode || !country || !email || !phone) {
      setError('Please fill in all contact and shipping fields.')
      return
    }

    // Phone number validation for all countries (E.164 standard check)
    const phoneClean = phone.replace(/[\s\-()]/g, '')
    const phoneRegex = /^\+?[0-9]{7,15}$/
    if (!phoneRegex.test(phoneClean)) {
      setError('Please enter a valid phone number (at least 7 digits, e.g., +8801712345678 or 01712345678).')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cartItems: items,
          shippingAddress: { address, city, postalCode, country },
          customerDetails: { email, phone },
          paymentMethod,
        }),
      })

      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        setError(data.message || 'Checkout failed. Please try again.')
      }
    } catch (err) {
      setError('Failed to reach backend server. Please check your connection.')
    } finally {
      setLoading(false)
    }
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
                    <div className="cart-item-img-wrap">
                      <img src={item.image || 'https://placehold.co/100x100/f2f0f1/333333?text=No+Image'} alt={item.name} className="cart-item-img" />
                    </div>

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
                        <span className="cart-item-price">BDT {item.price * item.qty}</span>
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

            {/* ── Order Summary & Checkout Form ── */}
            <div className="order-summary-container">
              <div className="order-summary">
                <h2 className="order-summary-title">Order Summary</h2>

                <div className="order-summary-rows">
                  <div className="order-row">
                    <span className="order-row-label">Subtotal</span>
                    <span className="order-row-value">BDT {subtotal}</span>
                  </div>
                  <div className="order-row">
                    <span className="order-row-label">Discount (-20%)</span>
                    <span className="order-row-value order-row-discount">BDT {-discountAmount}</span>
                  </div>
                  <div className="order-row">
                    <span className="order-row-label">Delivery Fee</span>
                    <span className="order-row-value">BDT {DELIVERY_FEE}</span>
                  </div>
                </div>

                <hr className="order-divider" />

                <div className="order-row order-total-row">
                  <span className="order-total-label">Total</span>
                  <span className="order-total-value">BDT {total}</span>
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

                {/* Initial Checkout Trigger */}
                {!showCheckoutForm && (
                  <button 
                    className="checkout-btn" 
                    onClick={() => {
                      if (!user) {
                        alert('Please login using the user icon in the header first.');
                      } else {
                        setShowCheckoutForm(true);
                      }
                    }}
                  >
                    Go to Checkout
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>

              {/* Checkout Form */}
              {showCheckoutForm && (
                <form className="checkout-shipping-form" onSubmit={handleProceedToPayment}>
                  <h3 className="checkout-form-title">Shipping & Payment</h3>
                  
                  {error && <p className="checkout-error-msg">{error}</p>}

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      id="email"
                      type="email" 
                      required 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                      id="phone"
                      type="tel" 
                      required 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      placeholder="e.g. +8801712345678"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="address">Street Address</label>
                    <input 
                      id="address"
                      type="text" 
                      required 
                      value={address} 
                      onChange={e => setAddress(e.target.value)} 
                      placeholder="House No, Road Name, Area"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input 
                        id="city"
                        type="text" 
                        required 
                        value={city} 
                        onChange={e => setCity(e.target.value)} 
                        placeholder="Dhaka"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="postcode">Postal Code</label>
                      <input 
                        id="postcode"
                        type="text" 
                        required 
                        value={postalCode} 
                        onChange={e => setPostalCode(e.target.value)} 
                        placeholder="1212"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input 
                      id="country"
                      type="text" 
                      required 
                      value={country} 
                      onChange={e => setCountry(e.target.value)} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Select Payment Method</label>
                    <div className="payment-options">
                      {paymentConfig.activeMethods.stripe && (
                        <label className={`payment-option ${paymentMethod === 'stripe' ? 'active' : ''}`}>
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="stripe" 
                            checked={paymentMethod === 'stripe'}
                            onChange={() => setPaymentMethod('stripe')} 
                          />
                          <span>International (Stripe / Cards)</span>
                        </label>
                      )}
                      {paymentConfig.activeMethods.sslcommerz && (
                        <label className={`payment-option ${paymentMethod === 'sslcommerz' ? 'active' : ''}`}>
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="sslcommerz" 
                            checked={paymentMethod === 'sslcommerz'}
                            onChange={() => setPaymentMethod('sslcommerz')} 
                          />
                          <span>Local (Bkash, Nagad, Cards)</span>
                        </label>
                      )}
                      {!paymentConfig.activeMethods.stripe && !paymentConfig.activeMethods.sslcommerz && (
                        <p className="checkout-error-msg" style={{ marginTop: 0 }}>
                          Checkouts are temporarily disabled. No active payment gateways available.
                        </p>
                      )}
                    </div>
                  </div>

                  <button 
                    className="proceed-payment-btn" 
                    type="submit" 
                    disabled={loading || (!paymentConfig.activeMethods.stripe && !paymentConfig.activeMethods.sslcommerz)}
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                  <button className="cancel-checkout-btn" type="button" onClick={() => setShowCheckoutForm(false)}>
                    Cancel
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

        {/* ── Order History Section ── */}
        {user && (
          <div className="order-history-section">
            <h2 className="order-history-title">My Orders</h2>
            {loadingOrders ? (
              <p>Loading orders...</p>
            ) : myOrders.length === 0 ? (
              <div className="empty-orders">
                <p>You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="orders-list">
                {myOrders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <p className="order-card-id">ORDER ID: {order._id}</p>
                        <p className="order-card-date">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="order-card-status">
                        <span className={`status-badge status-pay-${order.paymentStatus}`}>
                          Payment: {order.paymentStatus}
                        </span>
                        <span className={`status-badge status-del-${order.deliveryStatus}`}>
                          Delivery: {order.deliveryStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-card-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item-row">
                          <img src={item.image || 'https://placehold.co/100x100/f2f0f1/333333?text=No+Image'} alt={item.name} className="order-item-img" />
                          <div className="order-item-info">
                            <p className="order-item-name">{item.name}</p>
                            <p className="order-item-meta">Size: {item.size} | Color: {item.color}</p>
                            <p className="order-item-price">BDT {item.price} x {item.qty}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-card-footer">
                      <div className="order-actions">
                        {(order.paymentStatus === 'pending' || order.paymentStatus === 'failed') && order.deliveryStatus !== 'cancelled' && (
                          <>
                            <button 
                              className="order-btn pay-btn" 
                              onClick={() => handlePayExistingOrder(order._id, order.paymentMethod)}
                            >
                              Pay Now
                            </button>
                            <button 
                              className="order-btn cancel-btn" 
                              onClick={() => handleCancelOrder(order._id)}
                            >
                              Cancel Order
                            </button>
                          </>
                        )}
                      </div>
                      <p className="order-total-text">Total: <strong>BDT {order.totalAmount}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
