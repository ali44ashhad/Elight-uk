import { Inquiry } from '../../models/Inquiry.js';
import { Deal } from '../../models/Deal.js';
import { parsePagination } from '../../utils/pagination.js';
import { withId } from '../../utils/mapId.js';

export async function listInquiries(req, res) {
  const { source, propertyId, status } = req.query;
  const filter = {};
  if (source) filter.source = source;
  if (propertyId) filter.property = propertyId;
  if (status) filter.status = status;

  const pagination = parsePagination(req.query);
  const base = Inquiry.find(filter).sort({ createdAt: -1 }).populate('property', 'title location');

  if (!pagination) {
    const inquiries = await base.lean();
    const ids = inquiries.map((q) => q._id);
    const deals = await Deal.find({ inquiry: { $in: ids } }).select('inquiry').lean();
    const hasDealSet = new Set(deals.map((d) => String(d.inquiry)));
    const withFlag = inquiries.map((q) => ({
      ...q,
      hasDeal: hasDealSet.has(String(q._id)),
    }));
    return res.json(withId(withFlag));
  }

  const [total, data] = await Promise.all([
    Inquiry.countDocuments(filter),
    base.skip(pagination.skip).limit(pagination.limit).lean(),
  ]);

  const ids = data.map((q) => q._id);
  const deals = await Deal.find({ inquiry: { $in: ids } }).select('inquiry').lean();
  const hasDealSet = new Set(deals.map((d) => String(d.inquiry)));
  const withFlag = data.map((q) => ({
    ...q,
    hasDeal: hasDealSet.has(String(q._id)),
  }));

  return res.json({
    data: withId(withFlag),
    pagination: { ...pagination, total, pages: Math.ceil(total / pagination.limit) },
  });
}

