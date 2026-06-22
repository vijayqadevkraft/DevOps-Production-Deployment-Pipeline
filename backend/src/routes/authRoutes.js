import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev-secret-change-me', {
    expiresIn: '7d'
  });
}

function serializeUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'A user with this email already exists' });
  }

  const user = await User.create({ name, email, password, role });
  return res.status(201).json({ token: signToken(user), user: serializeUser(user) });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json({ token: signToken(user), user: serializeUser(user) });
}));

router.get('/me', protect, (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

export default router;
