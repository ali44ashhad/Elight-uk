import { ProviderApplication } from '../models/ProviderApplication.js';
import { User } from '../models/User.js';
import { withId } from '../utils/mapId.js';

export async function applyForProvider(req, res) {
  const userId = req.userId;
  const { phone, company, message } = req.body || {};

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.providerStatus === 'approved') {
    return res.status(409).json({ error: 'Already a provider' });
  }

  const existingPending = await ProviderApplication.findOne({ user: userId, status: 'pending' }).lean();
  if (existingPending) {
    return res.status(409).json({ error: 'Application already pending' });
  }

  const app = await ProviderApplication.create({
    user: userId,
    status: 'pending',
    submittedData: {
      phone: phone != null ? String(phone).trim() : '',
      company: company != null ? String(company).trim() : '',
      message: message != null ? String(message).trim() : '',
    },
  });

  user.providerStatus = 'pending';
  await user.save();

  const populated = await ProviderApplication.findById(app._id).populate('user', 'name email providerStatus').lean();
  res.status(201).json(withId(populated));
}

export async function getProviderStatus(req, res) {
  const userId = req.userId;
  const user = await User.findById(userId).select('name email providerStatus').lean();
  if (!user) return res.status(404).json({ error: 'User not found' });

  const latest = await ProviderApplication.findOne({ user: userId })
    .sort({ createdAt: -1 })
    .select('status submittedData reviewedAt rejectionReason createdAt updatedAt')
    .lean();

  res.json({
    user: withId(user),
    application: latest ? withId(latest) : null,
  });
}

