import { InvestorsLoungeSubmission } from '../../models/InvestorsLoungeSubmission.js';
import { parsePagination } from '../../utils/pagination.js';
import { withId } from '../../utils/mapId.js';

export async function listInvestorsLoungeSubmissions(req, res) {
  const { emailAddress } = req.query;
  const filter = {};
  if (emailAddress) filter.emailAddress = emailAddress;

  const pagination = parsePagination(req.query);
  const base = InvestorsLoungeSubmission.find(filter).sort({ createdAt: -1 });

  if (!pagination) {
    const docs = await base.lean();
    return res.json(withId(docs));
  }

  const [total, data] = await Promise.all([
    InvestorsLoungeSubmission.countDocuments(filter),
    base.skip(pagination.skip).limit(pagination.limit).lean(),
  ]);

  return res.json({
    data: withId(data),
    pagination: { ...pagination, total, pages: Math.ceil(total / pagination.limit) },
  });
}

