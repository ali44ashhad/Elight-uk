import mongoose from 'mongoose';

const generalQuerySchema = new mongoose.Schema(
  {
    propertyType: { type: String, required: true },
    propertyStyles: { type: [String], default: [] },
    bedrooms: { type: String },
    reason: { type: String },
    region: { type: String },
    district: { type: String },
    ward: { type: String },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String },
    telephone: { type: String },
    budget: { type: String },
    correspondenceAddress: { type: String },
    postcode: { type: String },
  },
  { timestamps: true }
);
generalQuerySchema.index({ createdAt: -1 });
generalQuerySchema.index({ propertyType: 1, createdAt: -1 });
export const GeneralQuery = mongoose.model('GeneralQuery', generalQuerySchema);