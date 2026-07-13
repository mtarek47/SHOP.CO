import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'yoursecretjwtkeyhere1234567890', {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Lax is better for frontend redirect callbacks (like payment gateways)
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  return token;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateTokenAndSetCookie(res, user._id);
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    generateTokenAndSetCookie(res, user._id);
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
