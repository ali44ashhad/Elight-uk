import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elite';

export async function connectDB() {
  const autoIndex = process.env.MONGOOSE_AUTOINDEX !== 'false';
  mongoose.set('autoIndex', autoIndex);
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected');
}
