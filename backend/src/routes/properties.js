import { Router } from 'express';
import { getProperty, listProperties } from '../controllers/public/propertiesController.js';

const router = Router();

// GET /api/properties — list for featured grid; Available first, then Under Offer, Sold last
router.get('/', (req, res, next) => {
  Promise.resolve(listProperties(req, res)).catch(next);
});

// GET /api/properties/:id — single property for detail page
router.get('/:id', (req, res, next) => {
  Promise.resolve(getProperty(req, res)).catch(next);
});

export default router;
