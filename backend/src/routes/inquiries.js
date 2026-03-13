import { Router } from 'express';
import { createInquiry, createInquiryDraft, updateInquiryDraft } from '../controllers/public/inquiriesController.js';

const router = Router();

// POST /api/inquiries — hero contact form or property "I Am Interested"
router.post('/', (req, res, next) => {
  Promise.resolve(createInquiry(req, res)).catch(next);
});

// POST /api/inquiries/draft — auto-saved partial inquiry
router.post('/draft', (req, res, next) => {
  Promise.resolve(createInquiryDraft(req, res)).catch(next);
});

// PATCH /api/inquiries/draft/:id — update draft fields
router.patch('/draft/:id', (req, res, next) => {
  Promise.resolve(updateInquiryDraft(req, res)).catch(next);
});

export default router;
