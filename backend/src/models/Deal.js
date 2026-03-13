import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    inquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' },
    investorName: { type: String, required: true },
    investorEmail: { type: String, required: true },
    investorPhone: String,
    budget: String,
    message: String,
    paymentAt: Date,
    underOfferAt: Date,
    rejectBy: Date,
    rejectedAt: Date,
    refundEligible: { type: Boolean, default: true },
    refundRequestedAt: Date,
    refundedAt: Date,
    status: { type: String, default: 'pending_payment' },
  },
  { timestamps: true }
);

dealSchema.index({ status: 1, createdAt: -1 });
dealSchema.index({ property: 1, createdAt: -1 });
dealSchema.index({ inquiry: 1 });

export const Deal = mongoose.model('Deal', dealSchema);
