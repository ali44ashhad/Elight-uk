import { Refund } from '../../models/Refund.js';
import { withId } from '../../utils/mapId.js';

export async function createRefund(req, res) {
  const { orderDate, dealPropertyAddress, purchaseEmail, cardLast4, reasonForRefund } = req.body;

  if (!orderDate || !dealPropertyAddress || !purchaseEmail || !cardLast4 || !reasonForRefund) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const doc = await Refund.create({
    orderDate: String(orderDate).trim(),
    dealPropertyAddress: String(dealPropertyAddress).trim(),
    purchaseEmail: String(purchaseEmail).trim(),
    cardLast4: String(cardLast4).trim(),
    reasonForRefund: String(reasonForRefund).trim(),
  });

  return res.status(201).json(withId(doc.toObject()));
}

