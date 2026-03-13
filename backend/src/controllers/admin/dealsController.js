import { Deal } from '../../models/Deal.js';
import { Property } from '../../models/Property.js';
import { Inquiry } from '../../models/Inquiry.js';
import { parsePagination } from '../../utils/pagination.js';
import { withId } from '../../utils/mapId.js';

export async function listDeals(req, res) {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const pagination = parsePagination(req.query);
  const base = Deal.find(filter).sort({ createdAt: -1 }).populate('property');

  if (!pagination) {
    const deals = await base.lean();
    return res.json(withId(deals));
  }

  const [total, data] = await Promise.all([
    Deal.countDocuments(filter),
    base.skip(pagination.skip).limit(pagination.limit).lean(),
  ]);

  return res.json({
    data: withId(data),
    pagination: { ...pagination, total, pages: Math.ceil(total / pagination.limit) },
  });
}

export async function createDealFromInquiry(req, res) {
  const { inquiryId } = req.body;
  if (!inquiryId) {
    return res.status(400).json({ error: 'inquiryId is required' });
  }

  const existing = await Deal.findOne({ inquiry: inquiryId }).lean();
  if (existing) {
    return res.status(400).json({ error: 'Deal already exists for this inquiry' });
  }

  const inquiry = await Inquiry.findById(inquiryId).populate('property');
  if (!inquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  if (!inquiry.property) {
    return res.status(400).json({ error: 'Inquiry is not linked to a property' });
  }

  const deal = await Deal.create({
    property: inquiry.property._id,
    inquiry: inquiry._id,
    investorName: inquiry.name || 'Investor',
    investorEmail: inquiry.email || '',
    investorPhone: inquiry.phone || undefined,
    budget: inquiry.budget || undefined,
    message: inquiry.message || undefined,
    status: 'pending_payment',
    refundEligible: true,
  });

  const created = await Deal.findById(deal._id).populate('property').lean();
  return res.status(201).json(withId(created));
}

export async function updateDeal(req, res) {
  const id = req.params.id;
  const { action, ...rest } = req.body;
  const deal = await Deal.findById(id).populate('property');
  if (!deal) return res.status(404).json({ error: 'Deal not found' });

  if (action === 'record_payment') {
    if (deal.status !== 'pending_payment') {
      return res.status(400).json({ error: 'Deal is not pending payment' });
    }
    const now = new Date();
    const rejectBy = new Date(now);
    rejectBy.setDate(rejectBy.getDate() + 14);
    deal.status = 'under_offer';
    deal.paymentAt = now;
    deal.underOfferAt = now;
    deal.rejectBy = rejectBy;
    deal.refundEligible = true;
    await deal.save();
    await Property.findByIdAndUpdate(
      deal.property._id,
      { status: 'UnderOffer', underOfferUntil: rejectBy },
      { runValidators: true }
    );
    const updated = await Deal.findById(id).populate('property').lean();
    return res.json(withId(updated));
  }

  if (action === 'mark_refunded') {
    if (deal.status !== 'rejected_refunded' && deal.status !== 'under_offer') {
      return res.status(400).json({ error: 'Deal not eligible for refund' });
    }
    const now = new Date();
    deal.status = 'rejected_refunded';
    deal.refundEligible = false;
    deal.refundedAt = now;
    await deal.save();
    await Property.findByIdAndUpdate(deal.property._id, { status: 'Available' }, { runValidators: true });
    const updated = await Deal.findById(id).populate('property').lean();
    return res.json(withId(updated));
  }

  if (action === 'mark_sold') {
    if (deal.status !== 'under_offer') {
      return res.status(400).json({ error: 'Deal must be under offer to mark sold' });
    }
    const now = new Date();
    deal.status = 'sold';
    deal.refundEligible = false;
    await deal.save();
    await Property.findByIdAndUpdate(
      deal.property._id,
      { status: 'Sold', soldAt: now },
      { runValidators: true }
    );
    const updated = await Deal.findById(id).populate('property').lean();
    return res.json(withId(updated));
  }

  if (rest.investorName !== undefined) deal.investorName = String(rest.investorName).trim();
  if (rest.investorEmail !== undefined) deal.investorEmail = String(rest.investorEmail).trim();
  if (rest.investorPhone !== undefined) deal.investorPhone = rest.investorPhone == null ? null : String(rest.investorPhone).trim();
  if (rest.budget !== undefined) deal.budget = rest.budget == null ? null : String(rest.budget).trim();
  if (rest.message !== undefined) deal.message = rest.message == null ? null : String(rest.message).trim();
  await deal.save();

  res.json(withId(deal.toObject()));
}

