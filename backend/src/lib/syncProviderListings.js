import { Property } from '../models/Property.js';

/**
 * When an approved provider's account is toggled, mirror visibility on all listings they created.
 * Admin-created properties (no createdByUser) are untouched.
 */
export async function setListingsActiveForProviderUser(userId, listingActive) {
  const uid = userId?.toString?.() || String(userId || '');
  if (!uid) return { modifiedCount: 0 };
  const res = await Property.updateMany(
    { createdByUser: uid },
    { $set: { listingActive } }
  );
  return { modifiedCount: res.modifiedCount ?? 0 };
}
