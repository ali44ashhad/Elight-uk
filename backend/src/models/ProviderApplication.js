import mongoose from 'mongoose';

const providerApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    submittedData: {
      phone: { type: String, default: '' },
      company: { type: String, default: '' },
      message: { type: String, default: '' },
    },
    reviewedByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    reviewedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

providerApplicationSchema.virtual('id').get(function () {
  return this._id?.toString();
});

providerApplicationSchema.index({ status: 1, createdAt: -1 });
providerApplicationSchema.index({ user: 1, status: 1 });

export const ProviderApplication = mongoose.model('ProviderApplication', providerApplicationSchema);

