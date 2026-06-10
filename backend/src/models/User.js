import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    companyName: { type: String, default: '', trim: true, maxlength: 200 },
    registeredNumber: { type: String, default: '', trim: true, maxlength: 50 },
    website: { type: String, default: '', trim: true, maxlength: 500 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 320 },
    passwordHash: { type: String, required: true },
    imagePublicId: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    preferences: {
      emailUpdates: { type: Boolean, default: true },
      whatsappUpdates: { type: Boolean, default: false },
      hideSoldProperties: { type: Boolean, default: false },
    },
    providerStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
      index: true,
    },
    /** When false, the user cannot sign in or call authenticated APIs. Approved providers also hide all their listings. */
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual('id').get(function () {
  return this._id?.toString();
});

export const User = mongoose.model('User', userSchema);

