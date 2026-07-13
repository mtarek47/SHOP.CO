import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Read JWT from cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Read JWT from Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yoursecretjwtkeyhere1234567890');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    next();
  } catch (error) {
    console.error('Auth verification failed:', error);
    return res.status(401).json({ message: 'Not authorized, token validation failed' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin role required' });
  }
};
