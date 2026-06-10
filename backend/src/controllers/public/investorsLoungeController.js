import { InvestorsLoungeSubmission } from '../../models/InvestorsLoungeSubmission.js';
import { withId } from '../../utils/mapId.js';

export async function createInvestorsLoungeSubmission(req, res) {
  const { fullName, mobileNumber, emailAddress, terms } = req.body || {};

  if (!fullName || !mobileNumber || !emailAddress) {
    return res.status(400).json({ error: 'Full name, mobile number and email address are required' });
  }

  const doc = await InvestorsLoungeSubmission.create({
    fullName: String(fullName).trim(),
    mobileNumber: String(mobileNumber).trim(),
    emailAddress: String(emailAddress).trim(),
    terms: Array.isArray(terms) ? terms.map((t) => String(t).trim()).filter(Boolean) : [],
  });

  return res.status(201).json(withId(doc.toObject()));
}

