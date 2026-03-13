import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { listInquiries } from '../../controllers/admin/inquiriesController.js';

const router = Router();
router.use(authMiddleware);

// GET /api/admin/inquiries — list all (for admin portal)
router.get('/', (req, res, next) => {
  Promise.resolve(listInquiries(req, res)).catch(next);
});

export default router;
