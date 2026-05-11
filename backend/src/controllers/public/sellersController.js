import { Seller } from '../../models/Seller.js';
import { withId } from '../../utils/mapId.js';

function normalizeSellerAvatar(s) {
  const user = s?.user && typeof s.user === 'object' ? s.user : null;
  if (s && !s.imageUrl && user?.imageUrl) {
    return { ...s, imageUrl: user.imageUrl };
  }
  return s;
}

export async function listSellers(req, res) {
  const sellers = await Seller.find()
    .sort({ name: 1 })
    .select('name imageUrl user')
    .populate('user', 'imageUrl')
    .lean();
  res.json(withId(sellers.map(normalizeSellerAvatar)));
}

export async function getSeller(req, res) {
  const seller = await Seller.findById(req.params.id).populate('user', 'imageUrl').lean();
  if (!seller) return res.status(404).json({ error: 'Seller not found' });
  res.json(withId(normalizeSellerAvatar(seller)));
}
