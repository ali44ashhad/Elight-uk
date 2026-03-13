import { Seller } from '../../models/Seller.js';
import { withId } from '../../utils/mapId.js';

export async function listSellers(req, res) {
  const sellers = await Seller.find().sort({ name: 1 }).select('name imageUrl').lean();
  res.json(withId(sellers));
}

export async function getSeller(req, res) {
  const seller = await Seller.findById(req.params.id).lean();
  if (!seller) return res.status(404).json({ error: 'Seller not found' });
  res.json(withId(seller));
}
