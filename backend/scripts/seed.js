import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/lib/db.js';
import { Admin } from '../src/models/index.js';
import { Property } from '../src/models/index.js';

async function seed() {
  await connectDB();

  const hash = await bcrypt.hash('admin123', 10);
  await Admin.findOneAndUpdate(
    { email: 'admin@elite.co.uk' },
    { email: 'admin@elite.co.uk', passwordHash: hash },
    { upsert: true, new: true }
  );
  console.log('Seeded admin: admin@elite.co.uk / admin123');

  const count = await Property.countDocuments();

  if (count > 0) {
    await Property.deleteMany({});
    console.log(`Cleared ${count} existing properties.`);
  }

  await Property.insertMany([
      {
        title: 'Modern Flat in Manchester',
        location: 'Manchester, UK',
        monthlyRent: 1200,
        expectedProfit: 180,
        roi: 18,
        investmentAmount: 12000,
        tenancyDetails: '12-month AST, professional tenant',
        status: 'Available',
        sortOrder: 100,
      },
      {
        title: '2 Bed House in Birmingham',
        location: 'Birmingham, UK',
        monthlyRent: 950,
        expectedProfit: 142,
        roi: 15,
        investmentAmount: 9500,
        tenancyDetails: '6-month AST, family tenant',
        status: 'Available',
        sortOrder: 90,
      },
      {
        title: 'Studio Apartment in Leeds',
        location: 'Leeds, UK',
        monthlyRent: 750,
        expectedProfit: 112,
        roi: 15,
        investmentAmount: 7500,
        tenancyDetails: '12-month AST, single professional',
        status: 'Available',
        sortOrder: 80,
      },
      {
        title: '3 Bed Semi in Liverpool',
        location: 'Liverpool, UK',
        monthlyRent: 1100,
        expectedProfit: 165,
        roi: 15,
        investmentAmount: 11000,
        tenancyDetails: '12-month AST, working family',
        status: 'UnderOffer',
        sortOrder: 70,
      },
      {
        title: '1 Bed Flat in Bristol',
        location: 'Bristol, UK',
        monthlyRent: 1050,
        expectedProfit: 157,
        roi: 15,
        investmentAmount: 10500,
        tenancyDetails: '12-month AST, professional tenant',
        status: 'Available',
        sortOrder: 60,
      },
      {
        title: '2 Bed Terrace in London (Zone 3)',
        location: 'London, UK',
        monthlyRent: 1800,
        expectedProfit: 270,
        roi: 15,
        investmentAmount: 18000,
        tenancyDetails: '12-month AST, professional couple',
        status: 'Sold',
        soldAt: new Date(),
        sortOrder: -1,
      },
    ]);
  console.log('Seeded 6 sample properties (Available, Under Offer, Sold).');

  await mongoose.disconnect();
  console.log('Seed done.');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
