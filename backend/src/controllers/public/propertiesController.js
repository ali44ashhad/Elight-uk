import { Property } from '../../models/Property.js';
import { parsePagination } from '../../utils/pagination.js';
import { withId } from '../../utils/mapId.js';

export async function listProperties(req, res) {
  const pagination = parsePagination(req.query);
  const { seller: sellerId } = req.query;

  const filter = sellerId ? { seller: sellerId } : {};
  const baseQuery = Property.find(filter).sort({ statusRank: 1, createdAt: -1 });
  // Featured grid doesn't need tenancy details; keep response small/fast.
  baseQuery
    .select(
      'title location monthlyRent expectedProfit roi investmentAmount status soldAt underOfferUntil images seller createdAt updatedAt statusRank highlights'
    )
    .populate('seller', 'name imageUrl');

  if (!pagination) {
    const properties = await baseQuery.lean();
    // normalize id for frontend
    const now = new Date();
    const normalized = properties.map((p) => {
      if (p.status === 'UnderOffer' && p.underOfferUntil && new Date(p.underOfferUntil) < now) {
        return { ...p, status: 'Available' };
      }
      return p;
    });
    return res.json(withId(normalized));
  }

  const [total, data] = await Promise.all([
    Property.countDocuments(filter),
    baseQuery.skip(pagination.skip).limit(pagination.limit).lean(),
  ]);

  const now = new Date();
  const normalizedPage = data.map((p) => {
    if (p.status === 'UnderOffer' && p.underOfferUntil && new Date(p.underOfferUntil) < now) {
      return { ...p, status: 'Available' };
    }
    return p;
  });

  return res.json({
    data: withId(normalizedPage),
    pagination: { ...pagination, total, pages: Math.ceil(total / pagination.limit) },
  });
}

export async function getProperty(req, res) {
  const property = await Property.findById(req.params.id).populate('seller').lean();
  if (!property) return res.status(404).json({ error: 'Property not found' });
  res.json(withId(property));
}

