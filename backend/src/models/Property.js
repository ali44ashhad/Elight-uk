import mongoose from 'mongoose';

const propertyImageSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    order: { type: Number, default: 0 },
  },
  { _id: true, timestamps: true }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    monthlyRent: { type: Number, required: true },
    expectedProfit: Number,
    roi: Number,
    investmentAmount: { type: Number, required: true },
    tenancyDetails: String,
    details: String,
    status: { type: String, default: 'Available' },
    statusRank: { type: Number, default: 0, index: true },
    soldAt: Date,
    underOfferUntil: Date,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    images: { type: [propertyImageSchema], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

propertySchema.virtual('id').get(function () {
  return this._id?.toString();
});

function computeStatusRank(status) {
  if (status === 'Available') return 0;
  if (status === 'UnderOffer') return 1;
  if (status === 'Sold') return 2;
  return 99;
}

propertySchema.pre('validate', function () {
  this.statusRank = computeStatusRank(this.status);
  if (this.status === 'Sold' && !this.soldAt) this.soldAt = new Date();
});

propertySchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate() || {};
  const $set = update.$set || update;

  if ($set.status !== undefined) {
    const nextStatusRank = computeStatusRank($set.status);
    update.$set = { ...(update.$set || {}), statusRank: nextStatusRank };
    if ($set.status === 'Sold') {
      update.$set.soldAt = update.$set.soldAt || new Date();
    }
    this.setUpdate(update);
  }
});

propertySchema.index({ statusRank: 1, createdAt: -1 });

export const Property = mongoose.model('Property', propertySchema); 