import { ProviderApplication } from '../../models/ProviderApplication.js';
import { User } from '../../models/User.js';
import { Seller } from '../../models/Seller.js';
import { withId } from '../../utils/mapId.js';

export async function listProviderApplications(req, res) {
  const status = req.query.status ? String(req.query.status) : '';
  const filter = status === 'pending' || status === 'approved' || status === 'rejected' ? { status } : {};

  const apps = await ProviderApplication.find(filter)
    .sort({ status: 1, createdAt: -1 })
    .populate('user', 'name email providerStatus')
    .lean();

  res.json(withId(apps));
}

export async function reviewProviderApplication(req, res) {
  const { action, reason } = req.body || {};
  const normalized = String(action || '').toLowerCase();
  if (normalized !== 'approve' && normalized !== 'reject') {
    return res.status(400).json({ error: "Invalid action. Use 'approve' or 'reject'." });
  }

  const app = await ProviderApplication.findById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });

  if (app.status !== 'pending') {
    return res.status(409).json({ error: 'Application already reviewed' });
  }

  const user = await User.findById(app.user);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (normalized === 'approve') {
    app.status = 'approved';
    app.rejectionReason = '';
    user.providerStatus = 'approved';

    // Ensure this provider has a public Seller profile for existing UI flows.
    const existingSeller = await Seller.findOne({ user: user._id }).select('_id').lean();
    if (!existingSeller) {
      await Seller.create({ name: user.name || user.email, user: user._id });
    }
    // If the user already has an avatar (uploaded before approval), sync it to their public Seller profile.
    // This keeps property cards + seller pages consistent immediately after approval.
    if (user.imageUrl) {
      try {
        await Seller.findOneAndUpdate(
          { user: user._id },
          { imagePublicId: user.imagePublicId || '', imageUrl: user.imageUrl || '' },
          { new: false }
        );
      } catch (e) {
        console.error('[seller.sync approval avatar]', e);
      }
    }
  } else {
    app.status = 'rejected';
    app.rejectionReason = reason != null ? String(reason).trim() : '';
    user.providerStatus = 'rejected';
  }

  app.reviewedByAdminId = req.adminId || null;
  app.reviewedAt = new Date();

  await Promise.all([app.save(), user.save()]);

  const populated = await ProviderApplication.findById(app._id).populate('user', 'name email providerStatus').lean();
  res.json(withId(populated));
}

