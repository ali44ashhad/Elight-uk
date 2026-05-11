import mongoose from 'mongoose';
import 'dotenv/config';
import { Property } from '../src/models/Property.js';
import { Seller } from '../src/models/Seller.js';

async function getOrCreateDefaultAdminSeller() {
  const name = String(process.env.ADMIN_SELLER_NAME || 'Elite').trim() || 'Elite';
  const imageUrl = String(process.env.ADMIN_SELLER_IMAGE_URL || '').trim();

  const update = { name };
  if (imageUrl) update.imageUrl = imageUrl;

  return await Seller.findOneAndUpdate({ name, user: null }, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI in environment');

  await mongoose.connect(uri);

  const defaultSeller = await getOrCreateDefaultAdminSeller();
  const sellerId = defaultSeller?._id;
  if (!sellerId) throw new Error('Failed to create default seller');

  const res = await Property.updateMany(
    { $or: [{ seller: null }, { seller: { $exists: false } }] },
    { $set: { seller: sellerId } }
  );

  console.log(
    JSON.stringify(
      {
        matched: res.matchedCount ?? res.n ?? 0,
        modified: res.modifiedCount ?? res.nModified ?? 0,
        sellerId: String(sellerId),
        sellerName: defaultSeller?.name,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

