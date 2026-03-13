import { Inquiry } from '../../models/Inquiry.js';
import { withId } from '../../utils/mapId.js';

export async function createInquiry(req, res) {
  const { name, email, phone, budget, message, propertyId, draftId } = req.body;
  if (!name || !email || !phone || !propertyId) {
    return res.status(400).json({ error: 'Name, email, phone and propertyId are required' });
  }

  // If a draft exists, upgrade it to submitted instead of creating a duplicate
  if (draftId) {
    const draft = await Inquiry.findById(draftId);
    if (draft && draft.status === 'draft') {
      draft.name = String(name).trim();
      draft.email = String(email).trim();
      draft.phone = String(phone).trim();
      draft.budget = budget != null ? String(budget).trim() : undefined;
      draft.message = message != null ? String(message).trim() : undefined;
      draft.source = 'property';
      draft.property = propertyId;
      draft.status = 'submitted';
      await draft.save();
      return res.status(201).json(withId(draft.toObject()));
    }
  }

  const inquiry = await Inquiry.create({
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    budget: budget != null ? String(budget).trim() : undefined,
    message: message != null ? String(message).trim() : undefined,
    source: 'property',
    property: propertyId,
    status: 'submitted',
  });

  res.status(201).json(withId(inquiry.toObject()));
}

export async function createInquiryDraft(req, res) {
  const { name, email, phone, budget, message, propertyId } = req.body;
  if (!propertyId) {
    return res.status(400).json({ error: 'propertyId is required for inquiry drafts' });
  }

  const inquiry = await Inquiry.create({
    name: name != null ? String(name).trim() : undefined,
    email: email != null ? String(email).trim() : undefined,
    phone: phone != null ? String(phone).trim() : undefined,
    budget: budget != null ? String(budget).trim() : undefined,
    message: message != null ? String(message).trim() : undefined,
    source: 'property',
    property: propertyId,
    status: 'draft',
  });

  res.status(201).json(withId(inquiry.toObject()));
}

export async function updateInquiryDraft(req, res) {
  const { id } = req.params;
  const { name, email, phone, budget, message } = req.body;

  const inquiry = await Inquiry.findById(id);
  if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
  if (inquiry.status !== 'draft') {
    return res.status(400).json({ error: 'Only draft inquiries can be updated' });
  }

  if (name !== undefined) inquiry.name = name != null ? String(name).trim() : undefined;
  if (email !== undefined) inquiry.email = email != null ? String(email).trim() : undefined;
  if (phone !== undefined) inquiry.phone = phone != null ? String(phone).trim() : undefined;
  if (budget !== undefined) inquiry.budget = budget != null ? String(budget).trim() : undefined;
  if (message !== undefined) inquiry.message = message != null ? String(message).trim() : undefined;

  await inquiry.save();
  res.json(withId(inquiry.toObject()));
}

