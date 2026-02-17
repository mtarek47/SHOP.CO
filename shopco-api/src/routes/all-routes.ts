// This file contains all route definitions. In production, split into separate files.
// Import this as needed in index.ts

import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import SSLCommerzPayment from 'sslcommerz-lts'
import { authenticate, authorize, AuthRequest } from '../middleware/all-middleware'
import { AppError, asyncHandler } from '../middleware/all-middleware'
import { generateAccessToken, generateRefreshToken } from '../middleware/all-middleware'
import { success, error } from '../middleware/all-middleware'

const prisma = new PrismaClient()

// ═══════════════════════════════════════════════════════════════════════════
// AUTH ROUTES - /api/auth
// ═══════════════════════════════════════════════════════════════════════════
const authRoutes = express.Router()

authRoutes.post('/register', asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body
  
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return error(res, 'Email already registered', 409)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName, phone }
  })

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken()
  
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  success(res, {
    accessToken,
    refreshToken,
    user: { id: user.id, email, firstName, lastName, role: user.role }
  }, 'Account created successfully', 201)
}))

authRoutes.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body
  
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    return error(res, 'Invalid email or password', 401)
  }

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken()
  
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } })
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  success(res, {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }
  })
}))

authRoutes.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  
  const rt = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true }
  })

  if (!rt || rt.revoked || rt.expiresAt < new Date()) {
    return error(res, 'Invalid or expired refresh token', 401)
  }

  await prisma.refreshToken.update({ where: { id: rt.id }, data: { revoked: true } })

  const newAccessToken = generateAccessToken(rt.userId)
  const newRefreshToken = generateRefreshToken()
  
  await prisma.refreshToken.create({
    data: {
      userId: rt.userId,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  success(res, { accessToken: newAccessToken, refreshToken: newRefreshToken })
}))

authRoutes.post('/logout', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  await prisma.refreshToken.updateMany({ where: { token: refreshToken }, data: { revoked: true } })
  success(res, null, 'Logged out successfully')
}))

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT ROUTES - /api/products
// ═══════════════════════════════════════════════════════════════════════════
const productRoutes = express.Router()

productRoutes.get('/featured', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 4
  const products = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { category: true, images: true, colors: true, sizes: true },
    take: limit,
    orderBy: { rating: 'desc' }
  })
  success(res, products)
}))

productRoutes.get('/new-arrivals', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 4
  const products = await prisma.product.findMany({
    where: { active: true, newArrival: true },
    include: { category: true, images: true, colors: true, sizes: true },
    take: limit,
    orderBy: { createdAt: 'desc' }
  })
  success(res, products)
}))

productRoutes.get('/search', asyncHandler(async (req, res) => {
  const q = req.query.q as string
  const page = parseInt(req.query.page as string) || 0
  const size = parseInt(req.query.size as string) || 12

  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { name: { contains: q, mode: 'insensitive' } } }
      ]
    },
    include: { category: true, images: true, colors: true, sizes: true },
    skip: page * size,
    take: size
  })

  const total = await prisma.product.count({
    where: {
      active: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    }
  })

  success(res, {
    content: products,
    page,
    size,
    totalElements: total,
    totalPages: Math.ceil(total / size)
  })
}))

productRoutes.get('/:id', asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { category: true, images: true, colors: true, sizes: true }
  })
  if (!product) return error(res, 'Product not found', 404)
  success(res, product)
}))

productRoutes.get('/slug/:slug', asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { category: true, images: true, colors: true, sizes: true }
  })
  if (!product) return error(res, 'Product not found', 404)
  success(res, product)
}))

productRoutes.get('/:id/related', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 4
  const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } })
  if (!product) return error(res, 'Product not found', 404)

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      active: true
    },
    include: { category: true, images: true, colors: true, sizes: true },
    take: limit,
    orderBy: { rating: 'desc' }
  })
  success(res, related)
}))

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY ROUTES - /api/categories
// ═══════════════════════════════════════════════════════════════════════════
const categoryRoutes = express.Router()

categoryRoutes.get('/', asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' }
  })
  success(res, categories)
}))

categoryRoutes.get('/:slug/products', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 0
  const size = parseInt(req.query.size as string) || 9
  const sort = req.query.sort as string || 'popular'

  const orderBy = sort === 'price_asc' ? { price: 'asc' as const }
    : sort === 'price_desc' ? { price: 'desc' as const }
    : sort === 'rating' ? { rating: 'desc' as const }
    : sort === 'newest' ? { createdAt: 'desc' as const }
    : { rating: 'desc' as const }

  const category = await prisma.category.findUnique({ where: { slug: req.params.slug } })
  if (!category) return error(res, 'Category not found', 404)

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, active: true },
    include: { category: true, images: true, colors: true, sizes: true },
    skip: page * size,
    take: size,
    orderBy
  })

  const total = await prisma.product.count({
    where: { categoryId: category.id, active: true }
  })

  success(res, {
    content: products,
    page,
    size,
    totalElements: total,
    totalPages: Math.ceil(total / size)
  })
}))

// ═══════════════════════════════════════════════════════════════════════════
// ORDER ROUTES - /api/orders
// ═══════════════════════════════════════════════════════════════════════════
const orderRoutes = express.Router()

orderRoutes.use(authenticate)

orderRoutes.post('/', asyncHandler(async (req: AuthRequest, res) => {
  const { items, shippingAddress, promoCode } = req.body
  const userId = req.user!.id

  let subtotal = 0
  const orderItems = []

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } })
    if (!product) continue
    const lineTotal = Number(product.price) * item.quantity
    subtotal += lineTotal
    orderItems.push({
      productId: product.id,
      productName: product.name,
      productImage: (await prisma.productImage.findFirst({ where: { productId: product.id, isPrimary: true } }))?.imageUrl,
      size: item.size,
      color: item.color,
      unitPrice: product.price,
      quantity: item.quantity,
      subtotal: lineTotal
    })
  }

  let discountAmount = 0
  if (promoCode) {
    const promo = await prisma.promoCode.findFirst({ where: { code: promoCode.toUpperCase(), active: true } })
    if (promo && (!promo.expiresAt || promo.expiresAt > new Date())) {
      if (subtotal >= Number(promo.minOrderAmount)) {
        discountAmount = promo.discountType === 'PERCENT'
          ? (subtotal * Number(promo.discountValue)) / 100
          : Number(promo.discountValue)
        await prisma.promoCode.update({ where: { id: promo.id }, data: { usedCount: { increment: 1 } } })
      }
    }
  }

  const deliveryFee = 15
  const total = subtotal - discountAmount + deliveryFee

  const order = await prisma.order.create({
    data: {
      userId,
      orderNumber: `SC-${Date.now()}`,
      status: 'PENDING',
      subtotal,
      discountAmount,
      deliveryFee,
      total,
      promoCode: promoCode?.toUpperCase(),
      shippingName: shippingAddress.fullName,
      shippingPhone: shippingAddress.phone,
      shippingAddress: shippingAddress.addressLine1,
      shippingCity: shippingAddress.city,
      shippingState: shippingAddress.state,
      shippingPostal: shippingAddress.postalCode,
      shippingCountry: shippingAddress.country,
      items: { create: orderItems }
    },
    include: { items: true }
  })

  success(res, order, 'Order created successfully', 201)
}))

orderRoutes.get('/', asyncHandler(async (req: AuthRequest, res) => {
  const page = parseInt(req.query.page as string) || 0
  const size = parseInt(req.query.size as string) || 10

  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    include: { items: true },
    skip: page * size,
    take: size,
    orderBy: { placedAt: 'desc' }
  })

  const total = await prisma.order.count({ where: { userId: req.user!.id } })

  success(res, {
    content: orders,
    page,
    size,
    totalElements: total,
    totalPages: Math.ceil(total / size)
  })
}))

orderRoutes.get('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const order = await prisma.order.findFirst({
    where: { id: parseInt(req.params.id), userId: req.user!.id },
    include: { items: true }
  })
  if (!order) return error(res, 'Order not found', 404)
  success(res, order)
}))

orderRoutes.patch('/:id/cancel', asyncHandler(async (req: AuthRequest, res) => {
  const order = await prisma.order.findFirst({
    where: { id: parseInt(req.params.id), userId: req.user!.id }
  })
  if (!order) return error(res, 'Order not found', 404)
  if (order.status !== 'PENDING') return error(res, 'Only PENDING orders can be cancelled', 400)

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: 'CANCELLED' },
    include: { items: true }
  })
  success(res, updated, 'Order cancelled')
}))

// ═══════════════════════════════════════════════════════════════════════════
// REVIEW ROUTES - /api/reviews
// ═══════════════════════════════════════════════════════════════════════════
const reviewRoutes = express.Router()

reviewRoutes.get('/product/:productId', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 0
  const size = parseInt(req.query.size as string) || 6

  const reviews = await prisma.review.findMany({
    where: { productId: parseInt(req.params.productId) },
    include: { user: { select: { firstName: true, lastName: true } } },
    skip: page * size,
    take: size,
    orderBy: { createdAt: 'desc' }
  })

  const total = await prisma.review.count({ where: { productId: parseInt(req.params.productId) } })

  success(res, {
    content: reviews.map(r => ({
      ...r,
      authorName: `${r.user.firstName} ${r.user.lastName.charAt(0)}.`
    })),
    page,
    size,
    totalElements: total,
    totalPages: Math.ceil(total / size)
  })
}))

reviewRoutes.post('/product/:productId', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { rating, title, body } = req.body
  const productId = parseInt(req.params.productId)

  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId: req.user!.id, productId } }
  })
  if (existing) return error(res, 'You have already reviewed this product', 409)

  const review = await prisma.review.create({
    data: {
      productId,
      userId: req.user!.id,
      rating,
      title,
      body,
      verified: true
    },
    include: { user: { select: { firstName: true, lastName: true } } }
  })

  // Update product rating
  const avg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true
  })
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: avg._avg.rating || 0,
      reviewCount: avg._count
    }
  })

  success(res, review, 'Review submitted', 201)
}))

// ═══════════════════════════════════════════════════════════════════════════
// USER ROUTES - /api/users
// ═══════════════════════════════════════════════════════════════════════════
const userRoutes = express.Router()

userRoutes.use(authenticate)

userRoutes.get('/me', asyncHandler(async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, createdAt: true }
  })
  success(res, user)
}))

userRoutes.put('/me', asyncHandler(async (req: AuthRequest, res) => {
  const { firstName, lastName, phone } = req.body
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { firstName, lastName, phone },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true }
  })
  success(res, user, 'Profile updated')
}))

// ═══════════════════════════════════════════════════════════════════════════
// PROMO ROUTES - /api/promo
// ═══════════════════════════════════════════════════════════════════════════
const promoRoutes = express.Router()

promoRoutes.post('/validate', asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body

  const promo = await prisma.promoCode.findFirst({
    where: { code: code.toUpperCase(), active: true }
  })

  if (!promo) {
    return success(res, { valid: false, message: 'Invalid promo code' })
  }

  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return success(res, { valid: false, message: 'Promo code has expired' })
  }

  if (orderAmount < Number(promo.minOrderAmount)) {
    return success(res, {
      valid: false,
      message: `Minimum order amount $${promo.minOrderAmount} required`
    })
  }

  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    return success(res, { valid: false, message: 'Promo code usage limit reached' })
  }

  const discountAmount = promo.discountType === 'PERCENT'
    ? (orderAmount * Number(promo.discountValue)) / 100
    : Math.min(Number(promo.discountValue), orderAmount)

  const finalTotal = Math.max(orderAmount - discountAmount + 15, 15)

  success(res, {
    valid: true,
    code: promo.code,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    discountAmount,
    finalTotal,
    message: 'Promo code applied successfully'
  })
}))

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT ROUTES (SSLCommerz) - /api/payment
// ═══════════════════════════════════════════════════════════════════════════
const paymentRoutes = express.Router()

const sslcz = new SSLCommerzPayment(
  process.env.SSLCOMMERZ_STORE_ID!,
  process.env.SSLCOMMERZ_STORE_PASSWORD!,
  process.env.SSLCOMMERZ_IS_LIVE === 'true'
)

paymentRoutes.post('/init/:orderId', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const order = await prisma.order.findFirst({
    where: { id: parseInt(req.params.orderId), userId: req.user!.id },
    include: { items: true }
  })
  
  if (!order) return error(res, 'Order not found', 404)
  if (order.paymentStatus === 'PAID') return error(res, 'Order already paid', 400)

  const data = {
    total_amount: Number(order.total),
    currency: 'BDT',
    tran_id: order.orderNumber,
    success_url: process.env.SSLCOMMERZ_SUCCESS_URL!,
    fail_url: process.env.SSLCOMMERZ_FAIL_URL!,
    cancel_url: process.env.SSLCOMMERZ_CANCEL_URL!,
    ipn_url: process.env.SSLCOMMERZ_IPN_URL!,
    shipping_method: 'Courier',
    product_name: `Order ${order.orderNumber}`,
    product_category: 'Clothing',
    product_profile: 'general',
    cus_name: order.shippingName,
    cus_email: req.user!.email,
    cus_add1: order.shippingAddress,
    cus_city: order.shippingCity,
    cus_postcode: order.shippingPostal,
    cus_country: order.shippingCountry,
    cus_phone: order.shippingPhone || '01700000000',
    ship_name: order.shippingName,
    ship_add1: order.shippingAddress,
    ship_city: order.shippingCity,
    ship_postcode: order.shippingPostal,
    ship_country: order.shippingCountry
  }

  const apiResponse = await sslcz.init(data)
  success(res, { gatewayUrl: apiResponse.GatewayPageURL })
}))

paymentRoutes.post('/success', asyncHandler(async (req, res) => {
  const { tran_id, val_id } = req.body

  const validation = await sslcz.validate({ val_id })
  if (validation.status !== 'VALID') {
    return res.redirect(process.env.FRONTEND_FAIL_URL!)
  }

  await prisma.order.update({
    where: { orderNumber: tran_id },
    data: {
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
      paymentMethod: 'SSLCommerz',
      transactionId: val_id
    }
  })

  res.redirect(`${process.env.FRONTEND_SUCCESS_URL}?order=${tran_id}`)
}))

paymentRoutes.post('/fail', async (req, res) => {
  const { tran_id } = req.body
  await prisma.order.update({
    where: { orderNumber: tran_id },
    data: { paymentStatus: 'FAILED' }
  })
  res.redirect(process.env.FRONTEND_FAIL_URL!)
})

paymentRoutes.post('/cancel', async (req, res) => {
  res.redirect(process.env.FRONTEND_CANCEL_URL!)
})

paymentRoutes.post('/ipn', asyncHandler(async (req, res) => {
  // IPN (Instant Payment Notification) handler
  console.log('IPN received:', req.body)
  res.status(200).send('OK')
}))

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES - /api/admin
// ═══════════════════════════════════════════════════════════════════════════
const adminRoutes = express.Router()

adminRoutes.use(authenticate, authorize('ADMIN'))

adminRoutes.get('/orders', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 0
  const size = parseInt(req.query.size as string) || 20

  const orders = await prisma.order.findMany({
    include: { user: { select: { email: true } }, items: true },
    skip: page * size,
    take: size,
    orderBy: { placedAt: 'desc' }
  })

  const total = await prisma.order.count()

  success(res, {
    content: orders,
    page,
    size,
    totalElements: total,
    totalPages: Math.ceil(total / size)
  })
}))

adminRoutes.patch('/orders/:id/status', asyncHandler(async (req, res) => {
  const order = await prisma.order.update({
    where: { id: parseInt(req.params.id) },
    data: { status: req.body.status }
  })
  success(res, order, 'Status updated')
}))

adminRoutes.get('/stats', asyncHandler(async (req, res) => {
  const totalUsers = await prisma.user.count()
  const totalOrders = await prisma.order.count()
  const totalRevenue = await prisma.order.aggregate({
    where: { paymentStatus: 'PAID' },
    _sum: { total: true }
  })
  success(res, {
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0
  })
}))

export {
  authRoutes,
  productRoutes,
  categoryRoutes,
  orderRoutes,
  reviewRoutes,
  userRoutes,
  promoRoutes,
  paymentRoutes,
  adminRoutes
}
