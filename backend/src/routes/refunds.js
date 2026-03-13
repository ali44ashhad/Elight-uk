import { Router } from 'express';
import { createRefund } from '../controllers/public/refundsController.js';

const router = Router();

// POST /api/refunds — refund request form
router.post('/', (req, res, next) => {
  Promise.resolve(createRefund(req, res)).catch(next);
});

export default router;

