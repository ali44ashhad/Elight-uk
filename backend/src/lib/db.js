import dns from 'dns';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elite';

function getConnectOptions() {
  const options = {};

  if (process.env.MONGODB_TLS_ALLOW_INVALID_CERTS === 'true') {
    options.tlsAllowInvalidCertificates = true;
  }

  if (process.env.MONGODB_DNS_SERVERS) {
    dns.setServers(
      process.env.MONGODB_DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean)
    );
  }

  return options;
}

export async function connectDB() {
  const autoIndex = process.env.MONGOOSE_AUTOINDEX !== 'false';
  mongoose.set('autoIndex', autoIndex);
  await mongoose.connect(MONGODB_URI, getConnectOptions());
  console.log('MongoDB connected');
}
