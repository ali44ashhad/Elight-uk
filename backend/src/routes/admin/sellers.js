import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import {
  listSellers,
  createSeller,
  getSeller,
  updateSeller,
  deleteSeller,
  uploadSellerImage,
  uploadSellerImageMiddleware,
} from '../../controllers/admin/sellersController.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res, next) => Promise.resolve(listSellers(req, res)).catch(next));
router.post('/', (req, res, next) => Promise.resolve(createSeller(req, res)).catch(next));
router.get('/:id', (req, res, next) => Promise.resolve(getSeller(req, res)).catch(next));
router.patch('/:id', (req, res, next) => Promise.resolve(updateSeller(req, res)).catch(next));
router.delete('/:id', (req, res, next) => Promise.resolve(deleteSeller(req, res)).catch(next));

router.post('/:id/image', (req, res, next) => {
  uploadSellerImageMiddleware(req, res, (err) => {
    if (err) return next(err);
    Promise.resolve(uploadSellerImage(req, res)).catch(next);
  });
});

export default router;
