# SHOP.CO API — Node.js + TypeScript + Prisma + SSLCommerz

Production-ready E-Commerce REST API with **integrated SSLCommerz payment gateway**.

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Language | TypeScript 5.5 |
| Framework | Express.js |
| ORM | Prisma 5 |
| Database | MySQL 8.0+ |
| Auth | JWT + bcrypt |
| Payment | SSLCommerz (Bangladesh) |
| Validation | Zod |

---

## 📦 What's Included

✅ Complete REST API (40+ endpoints)  
✅ JWT authentication with refresh tokens  
✅ **SSLCommerz payment integration** (10 lines of code!)  
✅ Role-based authorization (USER/ADMIN)  
✅ Full product catalog with search  
✅ Order management with promo codes  
✅ Review system with auto-rating updates  
✅ Database seeded with 27 products  
✅ TypeScript + Prisma type-safety  

---

## 🚀 Quick Start

### 1. Prerequisites

```bash
node --version  # 18.0.0 or higher
npm --version   # 9.0.0 or higher
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Create MySQL database:
```sql
CREATE DATABASE shopco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

**Required variables:**
```env
DATABASE_URL="mysql://user:password@localhost:3306/shopco"
JWT_SECRET="your-super-secret-key-min-32-chars"
SSLCOMMERZ_STORE_ID="your_store_id"
SSLCOMMERZ_STORE_PASSWORD="your_store_password"
SSLCOMMERZ_IS_LIVE=false
```

### 5. Run Migrations & Seed

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

This creates:
- ✅ 4 categories (Casual, Formal, Party, Gym)
- ✅ 27 products with images, colors, sizes
- ✅ 4 promo codes (WELCOME20, SAVE10, FLAT50, NEWUSER)
- ✅ Admin user (admin@shopco.com / Admin@123)

### 6. Start Development Server

```bash
npm run dev
```

API live at `http://localhost:5000/api` 🚀

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

```http
POST   /auth/register     # Create account
POST   /auth/login        # Login
POST   /auth/refresh      # Refresh access token
POST   /auth/logout       # Logout
```

**Register Example:**
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "abc123...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    }
  }
}
```

### Products

```http
GET    /products/featured?limit=4
GET    /products/new-arrivals?limit=4
GET    /products/search?q=shirt&page=0&size=12
GET    /products/:id
GET    /products/slug/:slug
GET    /products/:id/related?limit=4
```

### Categories

```http
GET    /categories
GET    /categories/:slug/products?page=0&size=9&sort=popular
```

Sort options: `popular`, `price_asc`, `price_desc`, `rating`, `newest`

### Orders (Auth Required)

```http
POST   /orders                  # Place order
GET    /orders?page=0&size=10   # My orders
GET    /orders/:id               # Order detail
PATCH  /orders/:id/cancel        # Cancel order
```

**Place Order:**
```json
POST /api/orders
Authorization: Bearer <token>

{
  "items": [
    { "productId": 1, "size": "Large", "color": "Blue", "quantity": 2 }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "01712345678",
    "addressLine1": "123 Main St",
    "city": "Dhaka",
    "state": "Dhaka Division",
    "postalCode": "1207",
    "country": "BD"
  },
  "promoCode": "WELCOME20"
}
```

### Payment (SSLCommerz)

```http
POST   /payment/init/:orderId    # Initialize payment gateway
POST   /payment/success          # Success callback (SSLCommerz)
POST   /payment/fail             # Fail callback
POST   /payment/cancel           # Cancel callback
POST   /payment/ipn              # IPN webhook
```

**Payment Flow:**
```
1. User places order → GET order ID
2. Call /payment/init/:orderId → GET gateway URL
3. Redirect user to SSLCommerz payment page
4. After payment, SSLCommerz redirects to your success/fail URL
5. Order status updated automatically
```

### Reviews

```http
GET    /reviews/product/:productId?page=0&size=6
POST   /reviews/product/:productId    # Auth required
```

### Promo Codes

```http
POST   /promo/validate
{
  "code": "WELCOME20",
  "orderAmount": 565
}
```

### User Profile (Auth Required)

```http
GET    /users/me      # Get profile
PUT    /users/me      # Update profile
```

### Admin (ADMIN role required)

```http
GET    /admin/orders?page=0&size=20
PATCH  /admin/orders/:id/status?status=SHIPPED
GET    /admin/stats
```

---

## 💳 SSLCommerz Integration

### 1. Get Credentials

Sign up at https://developer.sslcommerz.com/registration/

### 2. Configure .env

```env
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false  # Set true for production
```

### 3. Payment Flow (Frontend)

```javascript
// 1. Place order
const orderRes = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderPayload)
})
const { data: order } = await orderRes.json()

// 2. Initialize payment
const paymentRes = await fetch(`/api/payment/init/${order.id}`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
})
const { data } = await paymentRes.json()

// 3. Redirect to SSLCommerz
window.location.href = data.gatewayUrl
```

### 4. Success Page (React)

```jsx
// pages/order/success.tsx
const OrderSuccess = () => {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order')
  
  return <div>Payment successful! Order: {orderNumber}</div>
}
```

---

## 🛠 Development Commands

```bash
npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript
npm run start            # Run compiled JS
npm run prisma:generate  # Regenerate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Reseed database
```

---

## 🗄 Database Schema

10 tables:
- `users` - User accounts
- `refresh_tokens` - JWT refresh tokens
- `categories` - Product categories
- `products` - Product catalog
- `product_images` - Product photos
- `product_colors` - Available colors
- `product_sizes` - Available sizes
- `orders` - Customer orders
- `order_items` - Order line items
- `reviews` - Product reviews
- `promo_codes` - Discount codes
- `addresses` - Shipping addresses
- `wishlist` - User wishlists

---

## 🔐 Default Credentials

**Admin:**
- Email: `admin@shopco.com`
- Password: `Admin@123`

**Promo Codes:**
- `WELCOME20` - 20% off (no minimum)
- `SAVE10` - 10% off ($100 minimum)
- `FLAT50` - $50 off ($200 minimum)
- `NEWUSER` - 15% off (1 use per user)

---

## 🚢 Production Deployment

### Environment Variables

```env
NODE_ENV=production
DATABASE_URL=<production_db_url>
JWT_SECRET=<strong_random_secret>
SSLCOMMERZ_IS_LIVE=true
SSLCOMMERZ_STORE_ID=<live_store_id>
SSLCOMMERZ_STORE_PASSWORD=<live_password>
```

### Build & Run

```bash
npm run build
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

---

## 📝 Project Structure

```
shopco-api/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── routes/            # API routes
│   ├── middleware/        # Auth, errors, validation
│   ├── utils/             # Helpers
│   └── index.ts           # Express app
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🆚 Why Node.js over Spring Boot?

| Feature | Node.js | Spring Boot |
|---------|---------|-------------|
| **SSLCommerz Integration** | ✅ 10 lines | ⚠️ 200+ lines (manual) |
| **Bangladesh Payment SDKs** | ✅ Official support | ❌ Build yourself |
| **Memory Usage** | 80MB | 300MB |
| **Cold Start** | 0.5s | 3-8s |
| **Deployment Cost** | Cheaper | More expensive |
| **Learning Curve** | Moderate | Steep |

---

## 🤝 Support

Questions? Issues? Contact the SHOP.CO team or open a GitHub issue.

**Happy coding!** 🎉
