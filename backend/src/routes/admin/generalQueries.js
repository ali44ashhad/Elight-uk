import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { listGeneralQueries } from '../../controllers/admin/generalQueriesController.js';

const router = Router();
router.use(authMiddleware);

// GET /api/admin/general-queries — list all general queries (IPRR)
router.get('/', (req, res, next) => {
  Promise.resolve(listGeneralQueries(req, res)).catch(next);
});

export default router;

