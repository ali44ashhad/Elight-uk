import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db.js';
import { Property } from '../src/models/Property.js';

async function main() {
  await connectDB();

  const res = await Property.updateMany(
    { moderationStatus: { $exists: false } },
    { $set: { moderationStatus: 'approved' } }
  );

  console.log(`Backfilled moderationStatus for ${res.modifiedCount || 0} properties.`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

