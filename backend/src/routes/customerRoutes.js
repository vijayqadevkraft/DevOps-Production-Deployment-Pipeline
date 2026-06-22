import express from 'express';
import { Customer } from '../models/Customer.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();
router.use(protect);

router.get('/', asyncHandler(async (req, res) => {
  const { search = '', status = 'all' } = req.query;
  const filter = {};
  if (status !== 'all') filter.status = status;
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { company: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
  }

  const customers = await Customer.find(filter).populate('owner', 'name email').sort({ updatedAt: -1 });
  res.json(customers);
}));

router.post('/', asyncHandler(async (req, res) => {
  const customer = await Customer.create({ ...req.body, owner: req.user._id });
  res.status(201).json(await customer.populate('owner', 'name email'));
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('owner', 'name email');

  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  return res.json(customer);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  return res.status(204).send();
}));

export default router;
