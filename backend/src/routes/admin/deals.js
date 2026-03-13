import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { listDeals, updateDeal, createDealFromInquiry } from '../../controllers/admin/dealsController.js';

const router = Router();
router.use(authMiddleware);

// GET /api/admin/deals — list all with countdown & refund tracking
router.get('/', (req, res, next) => {
  Promise.resolve(listDeals(req, res)).catch(next);
});

// POST /api/admin/deals — create deal from inquiry
router.post('/', (req, res, next) => {
  Promise.resolve(createDealFromInquiry(req, res)).catch(next);
});

// PATCH /api/admin/deals/:id — record payment (→ Under Offer + 14-day countdown) or mark refunded / sold
router.patch('/:id', (req, res, next) => {
  Promise.resolve(updateDeal(req, res)).catch(next);
});

export default router;
