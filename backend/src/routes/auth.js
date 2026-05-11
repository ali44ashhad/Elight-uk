import { Router } from 'express';
import {
  changePassword,
  login,
  me,
  register,
  updateMe,
  uploadMeImage,
  uploadUserImageMiddleware,
} from '../controllers/authController.js';
import { userAuthMiddleware } from '../middleware/userAuth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res, next) => {
  Promise.resolve(register(req, res)).catch(next);
});

// POST /api/auth/login
router.post('/login', (req, res, next) => {
  Promise.resolve(login(req, res)).catch(next);
});

// GET /api/auth/me
router.get('/me', userAuthMiddleware, (req, res, next) => {
  Promise.resolve(me(req, res)).catch(next);
});

// PATCH /api/auth/me
router.patch('/me', userAuthMiddleware, (req, res, next) => {
  Promise.resolve(updateMe(req, res)).catch(next);
});

// POST /api/auth/me/image
router.post('/me/image', userAuthMiddleware, (req, res, next) => {
  uploadUserImageMiddleware(req, res, (err) => {
    if (err) return next(err);
    Promise.resolve(uploadMeImage(req, res)).catch(next);
  });
});

// POST /api/auth/change-password
router.post('/change-password', userAuthMiddleware, (req, res, next) => {
  Promise.resolve(changePassword(req, res)).catch(next);
});

export default router;

