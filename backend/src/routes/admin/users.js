import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { listUsers, patchUser } from '../../controllers/admin/usersController.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res, next) => Promise.resolve(listUsers(req, res)).catch(next));
router.patch('/:id', (req, res, next) => Promise.resolve(patchUser(req, res)).catch(next));

export default router;
