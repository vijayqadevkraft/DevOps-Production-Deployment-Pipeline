import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    return res.status(401).json({ message: 'User no longer exists' });
  }

  req.user = user;
  return next();
});
