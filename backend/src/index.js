import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import inquiries from './routes/inquiries.js';
import properties from './routes/properties.js';
import deals from './routes/deals.js';
import refunds from './routes/refunds.js';
import generalQueries from './routes/generalQueries.js';
import adminAuth from './routes/admin/auth.js';
import adminInquiries from './routes/admin/inquiries.js';
import adminProperties from './routes/admin/properties.js';
import adminDeals from './routes/admin/deals.js';
import adminRefunds from './routes/admin/refunds.js';
import adminGeneralQueries from './routes/admin/generalQueries.js';
import adminSellers from './routes/admin/sellers.js';
import sellers from './routes/sellers.js';
import { runFourteenDayCron } from './jobs/fourteenDayCron.js';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const allowedOrigins = [
  'https://elight-uk-393r.vercel.app',
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g. server-to-server, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);
app.use(express.json());

// Public API
app.use('/api/inquiries', inquiries);
app.use('/api/properties', properties);
app.use('/api/deals', deals);
app.use('/api/refunds', refunds);
app.use('/api/general-queries', generalQueries);
app.use('/api/sellers', sellers);

// Admin API
app.use('/api/admin', adminAuth);
app.use('/api/admin/inquiries', adminInquiries);
app.use('/api/admin/properties', adminProperties);
app.use('/api/admin/deals', adminDeals);
app.use('/api/admin/refunds', adminRefunds);
app.use('/api/admin/general-queries', adminGeneralQueries);
app.use('/api/admin/sellers', adminSellers);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// 14-day automation
runFourteenDayCron();

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err?.statusCode || err?.status || 500;
  const message = status === 500 ? 'Internal server error' : (err?.message || 'Error');
  res.status(status).json({ error: message });
});

async function start() {
  await connectDB();
  const maxPortTries = 10;

  const listenOnPort = (port) =>
    new Promise((resolve, reject) => {
      const server = app.listen(port, () => resolve({ server, port }));
      server.on('error', reject);
    });

  for (let i = 0; i < maxPortTries; i++) {
    const port = PORT + i;
    try {
      const { server, port: boundPort } = await listenOnPort(port);
      console.log(`Elite backend running at http://localhost:${boundPort}`);
      server.on('error', (err) => console.error('[server error]', err));
      return;
    } catch (err) {
      if (err?.code === 'EADDRINUSE' && i < maxPortTries - 1) {
        console.warn(`Port ${port} in use, trying ${port + 1}...`);
        continue;
      }
      throw err;
    }
  }
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
