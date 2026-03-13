# Elite Backend — UK Real Estate Investment

Backend for the UK-focused real estate investment website: investor inquiries, admin portal, property status (Available / Under Offer / Sold), and 14-day automated decision logic.

## Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** for admin auth
- **Cloudinary** for property image uploads
- **node-cron** for 14-day refund eligibility automation

## Setup

1. Install and run **MongoDB** locally (or use MongoDB Atlas and set `MONGODB_URI`).

2. In the backend folder:

```bash
cd backend
npm install
```

3. Create a `.env` file (or copy from `.env.example`):

```
MONGODB_URI=mongodb://127.0.0.1:27017/elite
PORT=4000
JWT_SECRET=your-secret-in-production

# Cloudinary (recommended)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
# Optional
# CLOUDINARY_FOLDER=elite/properties
```

4. Seed and start:

```bash
npm run db:seed
npm run dev
```

Server runs at **http://localhost:4000**.

## API Overview

### Public (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inquiries` | Hero or property inquiry. Body: `name`, `email`, `phone`, `budget?`, `message?`, `source?` (hero \| property), `propertyId?` |
| GET | `/api/properties` | List properties (Available → Under Offer → Sold; sold at bottom) |
| GET | `/api/properties/:id` | Single property with images |
| POST | `/api/deals` | "I Am Interested" — create deal. Body: `propertyId`, `investorName`, `investorEmail`, `investorPhone?`, `budget?`, `message?` |
| GET | `/api/deals/:id` | Get deal (countdown, status) |
| POST | `/api/deals/:id/reject` | Investor rejects within 14 days (refund eligible if before deadline) |

### Admin (Bearer token)

Login: **POST** `/api/admin/login` — Body: `email`, `password`. Returns `token`.  
Seed admin: `admin@elite.co.uk` / `admin123`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/me` | Current admin |
| GET | `/api/admin/inquiries` | List inquiries (query: `source`, `propertyId`) |
| GET | `/api/admin/properties` | List all properties |
| POST | `/api/admin/properties` | Create property |
| GET | `/api/admin/properties/:id` | Get property |
| PATCH | `/api/admin/properties/:id` | Update (title, location, rent, ROI, status, sortOrder, etc.) |
| DELETE | `/api/admin/properties/:id` | Delete property |
| POST | `/api/admin/properties/:id/images` | Upload images (multipart `images[]`) |
| DELETE | `/api/admin/properties/:propertyId/images/:imageId` | Delete image |
| GET | `/api/admin/deals` | List deals (query: `status`) |
| PATCH | `/api/admin/deals/:id` | **Actions:** `record_payment` (→ Under Offer + 14-day countdown), `mark_refunded`, `mark_sold` |

### Property status flow

1. **Available** — shown in grid; "Learn More" / "I Am Interested" allowed.
2. After payment, admin calls **PATCH /api/admin/deals/:id** with `action: 'record_payment'` → property becomes **Under Offer**, 14-day countdown starts.
3. **Within 14 days:** investor can **POST /api/deals/:id/reject** → refund eligible, property back to **Available**.
4. **After 14 days (no rejection):** cron sets `refundEligible = false`; refund button inactive.
5. If investor keeps deal, admin calls **PATCH /api/admin/deals/:id** with `action: 'mark_sold'` → property **Sold**, SOLD banner; no further actions.

### Sold property logic

- Sold properties remain visible, moved to bottom (sortOrder), SOLD banner, financial data visible, no inquiry button (enforced by status on frontend).

### Image URLs

- Images are uploaded to **Cloudinary**. Property `images[]` contains `secureUrl`/`url` plus `publicId`.

### 14-day automation

- Cron runs hourly. For deals in `under_offer` with `rejectBy` in the past, sets `refundEligible = false`.

## Environment

- `MONGODB_URI` — MongoDB connection string (default: `mongodb://127.0.0.1:27017/elite`).
- `PORT` — Server port (default: 4000).
- `JWT_SECRET` — Admin JWT secret (set in production).
