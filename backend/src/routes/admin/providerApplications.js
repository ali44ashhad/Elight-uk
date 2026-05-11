import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import {
  listProviderApplications,
  reviewProviderApplication,
} from '../../controllers/admin/providerApplicationsController.js';

const router = Router();
router.use(authMiddleware);

// GET /api/admin/provider-applications?status=pending|approved|rejected
router.get('/', (req, res, next) => Promise.resolve(listProviderApplications(req, res)).catch(next));

// PATCH /api/admin/provider-applications/:id  body: { action: 'approve'|'reject', reason? }
router.patch('/:id', (req, res, next) => Promise.resolve(reviewProviderApplication(req, res)).catch(next));

export default router;

