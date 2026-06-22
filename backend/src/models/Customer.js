import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    status: { type: String, enum: ['Lead', 'Prospect', 'Customer', 'Inactive'], default: 'Lead' },
    value: { type: Number, default: 0 },
    notes: { type: String, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

customerSchema.index({ name: 'text', company: 'text', email: 'text' });

export const Customer = mongoose.model('Customer', customerSchema);
