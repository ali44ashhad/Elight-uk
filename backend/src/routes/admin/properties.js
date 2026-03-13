import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import {
  createProperty,
  deleteProperty,
  deletePropertyImage,
  getAdminProperty,
  listAdminProperties,
  updateProperty,
  uploadImagesMiddleware,
  uploadPropertyImages,
} from '../../controllers/admin/propertiesController.js';

const router = Router();
router.use(authMiddleware);

// POST /api/admin/properties — create
router.post('/', (req, res, next) => Promise.resolve(createProperty(req, res)).catch(next));

// GET /api/admin/properties — list
router.get('/', (req, res, next) => Promise.resolve(listAdminProperties(req, res)).catch(next));

// GET /api/admin/properties/:id
router.get('/:id', (req, res, next) => Promise.resolve(getAdminProperty(req, res)).catch(next));

// PATCH /api/admin/properties/:id — update (ROI, rent, status, etc.)
router.patch('/:id', (req, res, next) => Promise.resolve(updateProperty(req, res)).catch(next));

// DELETE /api/admin/properties/:id
router.delete('/:id', (req, res, next) => Promise.resolve(deleteProperty(req, res)).catch(next));

// POST /api/admin/properties/:id/images — upload one or more images
router.post('/:id/images', (req, res, next) => {
  uploadImagesMiddleware(req, res, (err) => {
    if (err) return next(err);
    Promise.resolve(uploadPropertyImages(req, res)).catch(next);
  });
});

// DELETE /api/admin/properties/:propertyId/images/:imageId
router.delete('/:propertyId/images/:imageId', (req, res, next) =>
  Promise.resolve(deletePropertyImage(req, res)).catch(next)
);

export default router;
