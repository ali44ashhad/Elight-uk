import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // Cloudinary public ID for the seller avatar (if uploaded)
    imagePublicId: { type: String, default: '' },
    // Public URL (we'll generally store secure_url here)
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

sellerSchema.virtual('id').get(function () {
  return this._id?.toString();
});

sellerSchema.index({ name: 1 });

export const Seller = mongoose.model('Seller', sellerSchema);
