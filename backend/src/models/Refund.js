import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema(
  {
    orderDate: { type: String, required: true },
    dealPropertyAddress: { type: String, required: true },
    purchaseEmail: { type: String, required: true },
    cardLast4: { type: String, required: true },
    reasonForRefund: { type: String, required: true },
  },
  { timestamps: true }
);

refundSchema.index({ createdAt: -1 });
refundSchema.index({ purchaseEmail: 1, createdAt: -1 });

export const Refund = mongoose.model('Refund', refundSchema);

