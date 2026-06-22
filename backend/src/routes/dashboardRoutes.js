import express from 'express';
import { Customer } from '../models/Customer.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();
router.use(protect);

router.get('/summary', asyncHandler(async (req, res) => {
  const [totalCustomers, pipelineValue, byStatus] = await Promise.all([
    Customer.countDocuments(),
    Customer.aggregate([{ $group: { _id: null, total: { $sum: '$value' } } }]),
    Customer.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, value: { $sum: '$value' } } }])
  ]);

  res.json({
    totalCustomers,
    pipelineValue: pipelineValue[0]?.total || 0,
    byStatus
  });
}));

export default router;
