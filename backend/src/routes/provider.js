import { Router } from 'express';
import { applyForProvider, getProviderStatus } from '../controllers/providerController.js';
import {
  createProviderProperty,
  getMyProviderProperty,
  listMyProviderProperties,
  deleteProviderPropertyImage,
  uploadProviderImagesMiddleware,
  uploadProviderPropertyImages,
  updateProviderProperty,
} from '../controllers/providerPropertiesController.js';
import { userAuthMiddleware } from '../middleware/userAuth.js';

const router = Router();
router.use(userAuthMiddleware);

// POST /api/provider/apply
router.post('/apply', (req, res, next) => {
  Promise.resolve(applyForProvider(req, res)).catch(next);
});

// GET /api/provider/me
router.get('/me', (req, res, next) => {
  Promise.resolve(getProviderStatus(req, res)).catch(next);
});

// GET /api/provider/properties
router.get('/properties', (req, res, next) => {
  Promise.resolve(listMyProviderProperties(req, res)).catch(next);
});

// GET /api/provider/properties/:id
router.get('/properties/:id', (req, res, next) => {
  Promise.resolve(getMyProviderProperty(req, res)).catch(next);
});

// POST /api/provider/properties
router.post('/properties', (req, res, next) => {
  Promise.resolve(createProviderProperty(req, res)).catch(next);
});

// POST /api/provider/properties/:id/images
router.post('/properties/:id/images', (req, res, next) => {
  uploadProviderImagesMiddleware(req, res, (err) => {
    if (err) return next(err);
    Promise.resolve(uploadProviderPropertyImages(req, res)).catch(next);
  });
});

// DELETE /api/provider/properties/:propertyId/images/:imageId
router.delete('/properties/:propertyId/images/:imageId', (req, res, next) => {
  Promise.resolve(deleteProviderPropertyImage(req, res)).catch(next);
});

// PATCH /api/provider/properties/:id (only while pending)
router.patch('/properties/:id', (req, res, next) => {
  Promise.resolve(updateProviderProperty(req, res)).catch(next);
});

export default router;

