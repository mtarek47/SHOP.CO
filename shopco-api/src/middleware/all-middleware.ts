// ═══════════════════════════════════════════════════════════════════════════
// src/middleware/auth.middleware.ts
// ═══════════════════════════════════════════════════════════════════════════
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuthRequest extends Request {
  user?: { id: number; email: string; role: string }
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    
    if (!user || !user.enabled) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    req.user = { id: user.id, email: user.email, role: user.role }
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    next()
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// src/middleware/error.middleware.ts
// ═══════════════════════════════════════════════════════════════════════════
import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// ═══════════════════════════════════════════════════════════════════════════
// src/utils/jwt.util.ts
// ═══════════════════════════════════════════════════════════════════════════
import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  })
}

export const generateRefreshToken = () => {
  return require('crypto').randomBytes(64).toString('hex')
}

// ═══════════════════════════════════════════════════════════════════════════
// src/utils/response.util.ts
// ═══════════════════════════════════════════════════════════════════════════
import { Response } from 'express'

export const success = <T>(res: Response, data: T, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data })
}

export const error = (res: Response, message: string, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message })
}
