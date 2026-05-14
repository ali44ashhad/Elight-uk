import { Property } from '../../models/Property.js';
import { parsePagination } from '../../utils/pagination.js';
import { withId } from '../../utils/mapId.js';

function normalizeSellerAvatar(p) {
  const seller = p?.seller && typeof p.seller === 'object' ? p.seller : null;
  const user = seller?.user && typeof seller.user === 'object' ? seller.user : null;
  if (seller && !seller.imageUrl && user?.imageUrl) {
    return { ...p, seller: { ...seller, imageUrl: user.imageUrl } };
  }
  return p;
}

export async function listProperties(req, res) {
  const pagination = parsePagination(req.query);
  const { seller: sellerId } = req.query;

  // Backward compatible: older properties may not have moderationStatus or listingActive set.
  const filter = {
    $and: [
      { $or: [{ moderationStatus: 'approved' }, { moderationStatus: { $exists: false } }] },
      { $or: [{ listingActive: true }, { listingActive: { $exists: false } }] },
      ...(sellerId ? [{ seller: sellerId }] : []),
    ],
  };
  const baseQuery = Property.find(filter).sort({ statusRank: 1, createdAt: -1 });
  // Featured grid doesn't need tenancy details; keep response small/fast.
  baseQuery
    .select(
      'title location monthlyRent expectedProfit roi investmentAmount status soldAt underOfferUntil images seller createdAt updatedAt statusRank highlights'
    )
    .populate({
      path: 'seller',
      select: 'name imageUrl user',
      populate: { path: 'user', select: 'imageUrl' },
    });

  if (!pagination) {
    const properties = await baseQuery.lean();
    // normalize id for frontend
    const now = new Date();
    const normalized = properties.map((p) => {
      if (p.status === 'UnderOffer' && p.underOfferUntil && new Date(p.underOfferUntil) < now) {
        return normalizeSellerAvatar({ ...p, status: 'Available' });
      }
      return normalizeSellerAvatar(p);
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
      return normalizeSellerAvatar({ ...p, status: 'Available' });
    }
    return normalizeSellerAvatar(p);
  });

  return res.json({
    data: withId(normalizedPage),
    pagination: { ...pagination, total, pages: Math.ceil(total / pagination.limit) },
  });
}

export async function getProperty(req, res) {
  const property = await Property.findOne({
    _id: req.params.id,
    $and: [
      { $or: [{ moderationStatus: 'approved' }, { moderationStatus: { $exists: false } }] },
      { $or: [{ listingActive: true }, { listingActive: { $exists: false } }] },
    ],
  })
    .populate({
      path: 'seller',
      populate: { path: 'user', select: 'imageUrl' },
    })
    .lean();
  if (!property) return res.status(404).json({ error: 'Property not found' });
  res.json(withId(normalizeSellerAvatar(property)));
}

