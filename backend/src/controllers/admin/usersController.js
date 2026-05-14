import mongoose from 'mongoose';
import { User } from '../../models/User.js';
import { parsePagination } from '../../utils/pagination.js';
import { withId } from '../../utils/mapId.js';
import { setListingsActiveForProviderUser } from '../../lib/syncProviderListings.js';

function buildUserFilter(role) {
  if (role === 'providers') return { providerStatus: 'approved' };
  if (role === 'buyers') return { providerStatus: { $ne: 'approved' } };
  return {};
}

export async function listUsers(req, res) {
  const pagination = parsePagination(req.query);
  const role = req.query.role ? String(req.query.role).toLowerCase() : '';
  const q = req.query.q != null ? String(req.query.q).trim() : '';

  const filter = { ...buildUserFilter(role === 'providers' || role === 'buyers' ? role : '') };
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }

  const base = User.find(filter)
    .sort({ createdAt: -1 })
    .select('name email providerStatus isActive createdAt updatedAt');

  if (!pagination) {
    const users = await base.lean();
    return res.json(withId(users));
  }

  const [total, data] = await Promise.all([
    User.countDocuments(filter),
    base.skip(pagination.skip).limit(pagination.limit).lean(),
  ]);

  return res.json({
    data: withId(data),
    pagination: { ...pagination, total, pages: Math.ceil(total / pagination.limit) },
  });
}

export async function patchUser(req, res) {
  const { isActive } = req.body || {};
  if (typeof isActive !== 'boolean') {
    return res.status(400).json({ error: 'Body must include isActive as a boolean' });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  const user = await User.findById(req.params.id).select('name email providerStatus isActive');
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.isActive = isActive;
  await user.save();

  if (user.providerStatus === 'approved') {
    await setListingsActiveForProviderUser(user._id, isActive);
  }

  const fresh = await User.findById(user._id)
    .select('name email providerStatus isActive createdAt updatedAt')
    .lean();
  res.json(withId(fresh));
}
