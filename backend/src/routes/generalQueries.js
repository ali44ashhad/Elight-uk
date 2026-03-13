import { Router } from 'express';
import { createGeneralQuery } from '../controllers/public/generalQueriesController.js';

const router = Router();

// POST /api/general-queries — investment property requirement request form (IPRR)
router.post('/', (req, res, next) => {
  Promise.resolve(createGeneralQuery(req, res)).catch(next);
});

export default router;

