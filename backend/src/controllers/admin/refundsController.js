import { Refund } from '../../models/Refund.js';
import { parsePagination } from '../../utils/pagination.js';
import { withId } from '../../utils/mapId.js';

export async function listRefunds(req, res) {
  const { purchaseEmail } = req.query;
  const filter = {};
  if (purchaseEmail) filter.purchaseEmail = purchaseEmail;

  const pagination = parsePagination(req.query);
  const base = Refund.find(filter).sort({ createdAt: -1 });

  if (!pagination) {
    const refunds = await base.lean();
    return res.json(withId(refunds));
  }

  const [total, data] = await Promise.all([
    Refund.countDocuments(filter),
    base.skip(pagination.skip).limit(pagination.limit).lean(),
  ]);

  return res.json({
    data: withId(data),
    pagination: { ...pagination, total, pages: Math.ceil(total / pagination.limit) },
  });
}

