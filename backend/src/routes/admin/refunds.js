import { Router } from 'express';
import { listRefunds } from '../../controllers/admin/refundsController.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// GET /api/admin/refunds — list refund requests
router.get('/', (req, res, next) => {
  Promise.resolve(listRefunds(req, res)).catch(next);
});

export default router;

