# 🔐 SSLCommerz Setup Guide

Complete guide to integrate SSLCommerz payment gateway with SHOP.CO API.

---

## 📋 Step 1: Get SSLCommerz Account

### Sandbox (Testing)
1. Visit https://developer.sslcommerz.com/registration/
2. Fill the registration form
3. Verify your email
4. Login and get credentials from the dashboard

**Test Credentials (Sandbox):**
- Store ID: `test_store_id`
- Store Password: `test_password`

### Production
1. Visit https://sslcommerz.com/
2. Contact sales for merchant account
3. Submit business documents
4. Get live credentials after approval

---

## ⚙️ Step 2: Configure .env

```env
# Sandbox
SSLCOMMERZ_STORE_ID=your_sandbox_store_id
SSLCOMMERZ_STORE_PASSWORD=your_sandbox_password
SSLCOMMERZ_IS_LIVE=false

# Success/Fail URLs (Backend)
SSLCOMMERZ_SUCCESS_URL=http://localhost:5000/api/payment/success
SSLCOMMERZ_FAIL_URL=http://localhost:5000/api/payment/fail
SSLCOMMERZ_CANCEL_URL=http://localhost:5000/api/payment/cancel
SSLCOMMERZ_IPN_URL=http://localhost:5000/api/payment/ipn

# Frontend Redirect URLs
FRONTEND_SUCCESS_URL=http://localhost:5173/order/success
FRONTEND_FAIL_URL=http://localhost:5173/order/failed
FRONTEND_CANCEL_URL=http://localhost:5173/cart
```

**Production:**
```env
SSLCOMMERZ_IS_LIVE=true
SSLCOMMERZ_STORE_ID=your_live_store_id
SSLCOMMERZ_STORE_PASSWORD=your_live_password
```

---

## 💻 Step 3: Frontend Implementation

### React Example

```tsx
// src/hooks/useCheckout.ts
import { useState } from 'react'

export const useCheckout = () => {
  const [loading, setLoading] = useState(false)

  const checkout = async (orderData: any) => {
    setLoading(true)
    try {
      // 1. Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      const { data: order } = await orderRes.json()

      // 2. Initialize payment
      const paymentRes = await fetch(`/api/payment/init/${order.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      const { data: payment } = await paymentRes.json()

      // 3. Redirect to SSLCommerz
      window.location.href = payment.gatewayUrl
      
    } catch (error) {
      console.error('Checkout failed:', error)
      setLoading(false)
    }
  }

  return { checkout, loading }
}
```

### Checkout Button

```tsx
// src/pages/CartPage.tsx
import { useCheckout } from '../hooks/useCheckout'

export const CartPage = () => {
  const { checkout, loading } = useCheckout()

  const handleCheckout = () => {
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.id,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity
      })),
      shippingAddress: {
        fullName: 'John Doe',
        phone: '01712345678',
        addressLine1: '123 Main St',
        city: 'Dhaka',
        state: 'Dhaka Division',
        postalCode: '1207',
        country: 'BD'
      },
      promoCode: appliedPromo || undefined
    }

    checkout(orderData)
  }

  return (
    <button 
      onClick={handleCheckout} 
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Proceed to Payment'}
    </button>
  )
}
```

### Success Page

```tsx
// src/pages/OrderSuccess.tsx
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export const OrderSuccess = () => {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (orderNumber) {
      // Fetch order details
      fetch(`/api/orders?orderNumber=${orderNumber}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
        .then(res => res.json())
        .then(data => setOrder(data.data))
    }
  }, [orderNumber])

  if (!order) return <div>Loading...</div>

  return (
    <div className="success-page">
      <h1>✅ Payment Successful!</h1>
      <p>Order Number: {orderNumber}</p>
      <p>Total: ${order.total}</p>
      <button onClick={() => navigate('/orders')}>View My Orders</button>
    </div>
  )
}
```

---

## 🧪 Step 4: Testing with Sandbox

### Test Cards (Sandbox Only)

SSLCommerz provides test cards that simulate different scenarios:

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)

**Failed Payment:**
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVV: Any 3 digits

**Canceled Payment:**
Just click "Cancel" button on payment page

### Testing Flow

1. Start backend: `npm run dev`
2. Start frontend: `npm run dev`
3. Add products to cart
4. Go to checkout
5. Fill shipping details
6. Click "Proceed to Payment"
7. Use test card: `4111 1111 1111 1111`
8. Complete payment
9. Verify redirect to success page
10. Check order status in database

---

## 🔍 Step 5: Verify Integration

### Check Order Status

```bash
# Via API
curl -X GET "http://localhost:5000/api/orders/1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Via Prisma Studio
npm run prisma:studio
# Navigate to: orders table
# Check: paymentStatus = PAID, transactionId = filled
```

### Check Database

```sql
SELECT 
  orderNumber,
  status,
  paymentStatus,
  total,
  transactionId,
  placedAt
FROM orders
WHERE userId = 1
ORDER BY placedAt DESC;
```

---

## 🚀 Step 6: Go Live

### Pre-Launch Checklist

- [ ] Get live SSLCommerz credentials
- [ ] Update `.env` with live credentials
- [ ] Set `SSLCOMMERZ_IS_LIVE=true`
- [ ] Update success/fail URLs to production domain
- [ ] Test with real BDT 10 transaction
- [ ] Enable IPN (Instant Payment Notification)
- [ ] Setup webhook monitoring
- [ ] Add error tracking (Sentry)
- [ ] Configure SSL certificate
- [ ] Test on mobile devices

### Production URLs

```env
# Backend (deployed on your-domain.com)
SSLCOMMERZ_SUCCESS_URL=https://api.your-domain.com/api/payment/success
SSLCOMMERZ_FAIL_URL=https://api.your-domain.com/api/payment/fail
SSLCOMMERZ_CANCEL_URL=https://api.your-domain.com/api/payment/cancel
SSLCOMMERZ_IPN_URL=https://api.your-domain.com/api/payment/ipn

# Frontend redirects
FRONTEND_SUCCESS_URL=https://your-domain.com/order/success
FRONTEND_FAIL_URL=https://your-domain.com/order/failed
FRONTEND_CANCEL_URL=https://your-domain.com/cart
```

---

## 🐛 Troubleshooting

### Error: "Invalid Store ID"
**Solution:** Check your `.env` file. Ensure `SSLCOMMERZ_STORE_ID` matches your dashboard.

### Error: "Invalid Hash"
**Solution:** Check `SSLCOMMERZ_STORE_PASSWORD`. Must match exactly (case-sensitive).

### Payment Success but Order Status Not Updated
**Solution:** Check `SSLCOMMERZ_SUCCESS_URL` is correct and publicly accessible.

### IPN Not Working
**Solution:** Ensure your server is publicly accessible. Use ngrok for local testing:
```bash
ngrok http 5000
# Update IPN URL to: https://abc123.ngrok.io/api/payment/ipn
```

### Transaction Not Validated
**Solution:** Check `val_id` parameter in success callback. Call `sslcz.validate({ val_id })`.

---

## 📞 Support

- **SSLCommerz Docs:** https://developer.sslcommerz.com/
- **Support Email:** integration@sslcommerz.com
- **Phone:** +880 1799-717117
- **Live Chat:** Available on merchant dashboard

---

## 💡 Pro Tips

1. **Always validate transactions** on success callback using `sslcz.validate()`
2. **Use IPN** for real-time payment updates (don't rely only on redirects)
3. **Store `transactionId`** for refund/dispute resolution
4. **Test failed payments** to ensure proper error handling
5. **Log all payment attempts** for debugging
6. **Use unique `tran_id`** (we use `orderNumber`)
7. **Handle timeout scenarios** (user closes browser during payment)
8. **Show loading state** during payment initialization
9. **Implement retry logic** for failed API calls
10. **Monitor payment success rate** (aim for >95%)

---

**You're all set!** 🎉

Start testing with sandbox and go live when ready. Happy selling! 🚀
