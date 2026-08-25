import { ProviderApplication } from '../models/ProviderApplication.js';
import { User } from '../models/User.js';
import { withId } from '../utils/mapId.js';
import { createPendingProviderApplication, ensureAgreementPdfUploaded, needsAgreementRebuild } from '../lib/createProviderApplication.js';

export async function applyForProvider(req, res) {
  const userId = req.userId;
  const { phone, company, message, address } = req.body || {};

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.providerStatus === 'approved') {
    return res.status(409).json({ error: 'Already a provider' });
  }

  const existingPending = await ProviderApplication.findOne({ user: userId, status: 'pending' }).lean();
  if (existingPending) {
    return res.status(409).json({ error: 'Application already pending' });
  }

  if (address != null && String(address).trim()) {
    user.address = String(address).trim();
  }

  const app = await createPendingProviderApplication(user, {
    phone,
    company,
    message,
  });

  user.providerStatus = 'pending';
  await user.save();

  const populated = await ProviderApplication.findById(app._id)
    .populate('user', 'name email providerStatus companyName registeredNumber website address')
    .lean();
  res.status(201).json(withId(populated));
}

export async function getProviderStatus(req, res) {
  const userId = req.userId;
  const user = await User.findById(userId).select('name email providerStatus address').lean();
  if (!user) return res.status(404).json({ error: 'User not found' });

  const latestDoc = await ProviderApplication.findOne({ user: userId }).sort({ createdAt: -1 });
  if (latestDoc && needsAgreementRebuild(latestDoc)) {
    try {
      const partyUser = await User.findById(userId)
        .select('name companyName registeredNumber website email address')
        .lean();
      await ensureAgreementPdfUploaded(latestDoc, partyUser);
    } catch (e) {
      console.error('[agreement.ensure]', e);
    }
  }

  const latest = latestDoc ? latestDoc.toObject({ virtuals: true }) : null;
  res.json({
    user: withId(user),
    application: latest ? withId(latest) : null,
  });
}
