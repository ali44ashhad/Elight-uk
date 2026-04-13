import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { listInvestorsLoungeSubmissions } from '../../controllers/admin/investorsLoungeController.js';

const router = Router();
router.use(authMiddleware);

// GET /api/admin/investors-lounge — list all Investors Lounge submissions
router.get('/', (req, res, next) => {
  Promise.resolve(listInvestorsLoungeSubmissions(req, res)).catch(next);
});

export default router;

