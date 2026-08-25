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
    agreement: {
      partyB: {
        name: { type: String, default: '' },
        companyName: { type: String, default: '' },
        registeredNumber: { type: String, default: '' },
        website: { type: String, default: '' },
        email: { type: String, default: '' },
        address: { type: String, default: '' },
      },
      generatedAt: { type: Date, default: null },
      pdfUrl: { type: String, default: '' },
      pdfPublicId: { type: String, default: '' },
      templateVersion: { type: Number, default: 0 },
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

