import { Seller } from '../../models/Seller.js';
import { withId } from '../../utils/mapId.js';

function normalizeSellerAvatar(s) {
  const user = s?.user && typeof s.user === 'object' ? s.user : null;
  if (s && !s.imageUrl && user?.imageUrl) {
    return { ...s, imageUrl: user.imageUrl };
  }
  return s;
}

/** Remove fields that should not be exposed on public seller payloads. */
function stripSellerUser(s) {
  if (!s?.user || typeof s.user !== 'object') return s;
  const { isActive: _ignored, ...userRest } = s.user;
  return { ...s, user: userRest };
}

export async function listSellers(req, res) {
  const sellers = await Seller.find()
    .sort({ name: 1 })
    .select('name imageUrl user')
    .populate('user', 'imageUrl isActive')
    .lean();
  const visible = sellers.filter((s) => {
    const u = s?.user;
    if (u && typeof u === 'object' && u.isActive === false) return false;
    return true;
  });
  res.json(withId(visible.map((s) => stripSellerUser(normalizeSellerAvatar(s)))));
}

export async function getSeller(req, res) {
  const seller = await Seller.findById(req.params.id).populate('user', 'imageUrl isActive').lean();
  if (!seller) return res.status(404).json({ error: 'Seller not found' });
  const u = seller?.user;
  if (u && typeof u === 'object' && u.isActive === false) {
    return res.status(404).json({ error: 'Seller not found' });
  }
  res.json(withId(stripSellerUser(normalizeSellerAvatar(seller))));
}
