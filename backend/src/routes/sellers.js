import { Router } from 'express';
import { listSellers, getSeller } from '../controllers/public/sellersController.js';

const router = Router();

router.get('/', (req, res, next) => Promise.resolve(listSellers(req, res)).catch(next));
router.get('/:id', (req, res, next) => Promise.resolve(getSeller(req, res)).catch(next));

export default router;
