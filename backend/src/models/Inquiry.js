import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    budget: String,
    message: String,
    source: { type: String, default: 'property' },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    status: { type: String, default: 'submitted' }, // 'draft' | 'submitted'
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ source: 1, createdAt: -1 });
inquirySchema.index({ property: 1, createdAt: -1 });
inquirySchema.index({ status: 1, createdAt: -1 });

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
