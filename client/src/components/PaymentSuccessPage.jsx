import React, { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'

const PaymentSuccessPage = ({ onNavigateHome }) => {
  const { clearCart } = useCart()
  const [status, setStatus] = useState('verifying') // 'verifying' | 'success' | 'failed'
  const [orderDetails, setOrderDetails] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(window.location.search)
    const gateway = params.get('gateway')
    const sessionId = params.get('session_id')
    const orderId = params.get('order_id')
    const isMock = params.get('mock') === 'true'

    if (!gateway || !sessionId || !orderId) {
      setStatus('failed')
      setErrorMsg('Missing checkout session details. Unable to verify payment.')
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payments/verify?gateway=${gateway}&session_id=${sessionId}&order_id=${orderId}`, {
          credentials: 'include'
        })
        const data = await res.json()
        
        if (res.ok && data.success) {
          setOrderDetails(data.order)
          setStatus('success')
          clearCart() // Clear the shopping cart on success!
        } else {
          setStatus('failed')
          setErrorMsg(data.message || 'Payment verification failed. Please contact support.')
        }
      } catch (err) {
        // If server is not responding, fallback for mock dev
        if (isMock) {
          setStatus('success')
          clearCart()
        } else {
          setStatus('failed')
          setErrorMsg('Failed to connect to backend server for verification.')
        }
      }
    }

    verify()
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: 'var(--font-primary)'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        padding: '40px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--gray-200)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        backgroundColor: '#fff'
      }}>
        {status === 'verifying' && (
          <div>
            <div className="spinner" style={{
              width: '50px',
              height: '50px',
              border: '4px solid var(--gray-200)',
              borderTop: '4px solid var(--black)',
              borderRadius: '50%',
              margin: '0 auto 24px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <h2 style={{ fontWeight: '700', fontSize: '22px', marginBottom: '12px' }}>Verifying Payment</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>Please do not close this window. We are confirming your transaction with the bank...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#E8F5E9',
              color: '#2E7D32',
              fontSize: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontWeight: 'bold'
            }}>✓</div>
            <h2 style={{ fontWeight: '700', fontSize: '24px', marginBottom: '12px', color: '#2E7D32' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '15px', marginBottom: '24px' }}>
              Thank you for your order. Your payment has been confirmed and we have started processing your shipment.
            </p>
            {orderDetails && (
              <div style={{
                textAlign: 'left',
                backgroundColor: 'var(--off-white)',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                fontSize: '14px',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Order ID:</span>
                  <span style={{ fontWeight: '600' }}>{orderDetails._id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Total Amount:</span>
                  <span style={{ fontWeight: '600' }}>BDT {orderDetails.totalAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Status:</span>
                  <span style={{ fontWeight: '600', color: '#2E7D32', textTransform: 'uppercase' }}>PAID</span>
                </div>
              </div>
            )}
            <button 
              onClick={onNavigateHome} 
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--black)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'background-color var(--transition)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--gray-600)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--black)'}
            >
              Continue Shopping
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#FFEBEE',
              color: '#C62828',
              fontSize: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontWeight: 'bold'
            }}>✕</div>
            <h2 style={{ fontWeight: '700', fontSize: '24px', marginBottom: '12px', color: '#C62828' }}>Verification Failed</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '15px', marginBottom: '24px' }}>
              {errorMsg || 'We were unable to confirm your payment transaction. Please verify with your payment provider.'}
            </p>
            <button 
              onClick={onNavigateHome} 
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--black)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'background-color var(--transition)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--gray-600)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--black)'}
            >
              Back to Home
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default PaymentSuccessPage
