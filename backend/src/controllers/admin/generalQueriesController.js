import { GeneralQuery } from '../../models/GeneralQuery.js';
import { parsePagination } from '../../utils/pagination.js';
import { withId } from '../../utils/mapId.js';

export async function listGeneralQueries(req, res) {
  const { propertyType, email } = req.query;
  const filter = {};
  if (propertyType) filter.propertyType = propertyType;
  if (email) filter.email = email;

  const pagination = parsePagination(req.query);
  const base = GeneralQuery.find(filter).sort({ createdAt: -1 });

  if (!pagination) {
    const docs = await base.lean();
    return res.json(withId(docs));
  }

  const [total, data] = await Promise.all([
    GeneralQuery.countDocuments(filter),
    base.skip(pagination.skip).limit(pagination.limit).lean(),
  ]);

  return res.json({
    data: withId(data),
    pagination: { ...pagination, total, pages: Math.ceil(total / pagination.limit) },
  });
}

