import { Router } from 'express';
import { createInvestorsLoungeSubmission } from '../controllers/public/investorsLoungeController.js';

const router = Router();

// POST /api/investors-lounge — popup form submissions from homepage
router.post('/', (req, res, next) => {
  Promise.resolve(createInvestorsLoungeSubmission(req, res)).catch(next);
});

export default router;

