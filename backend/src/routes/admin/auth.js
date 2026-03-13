import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { login, me } from '../../controllers/admin/authController.js';

const router = Router();

// POST /api/admin/login
router.post('/login', (req, res, next) => {
  Promise.resolve(login(req, res)).catch(next);
});

// GET /api/admin/me (protected)
router.get('/me', authMiddleware, (req, res, next) => {
  Promise.resolve(me(req, res)).catch(next);
});

export default router;
