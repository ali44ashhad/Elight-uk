import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // Optional link to a self-serve provider (User). Admin-created sellers can leave this null.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
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
sellerSchema.index({ user: 1 }, { unique: true, sparse: true });

export const Seller = mongoose.model('Seller', sellerSchema);
