import { GeneralQuery } from '../../models/GeneralQuery.js';
import { withId } from '../../utils/mapId.js';

export async function createGeneralQuery(req, res) {
  const {
    propertyType,
    propertyStyles,
    bedrooms,
    reason,
    region,
    district,
    ward,
    fullName,
    email,
    mobile,
    telephone,
    budget,
    correspondenceAddress,
    postcode,
  } = req.body;

  if (!propertyType || !fullName || !email) {
    return res.status(400).json({ error: 'Property type, full name and email are required' });
  }

  const doc = await GeneralQuery.create({
    propertyType: String(propertyType).trim(),
    propertyStyles: Array.isArray(propertyStyles)
      ? propertyStyles.map((s) => String(s).trim()).filter(Boolean)
      : [],
    bedrooms: bedrooms != null ? String(bedrooms).trim() : undefined,
    reason: reason != null ? String(reason).trim() : undefined,
    region: region != null ? String(region).trim() : undefined,
    district: district != null ? String(district).trim() : undefined,
    ward: ward != null ? String(ward).trim() : undefined,
    fullName: String(fullName).trim(),
    email: String(email).trim(),
    mobile: mobile != null ? String(mobile).trim() : undefined,
    telephone: telephone != null ? String(telephone).trim() : undefined,
    budget: budget != null ? String(budget).trim() : undefined,
    correspondenceAddress: correspondenceAddress != null ? String(correspondenceAddress).trim() : undefined,
    postcode: postcode != null ? String(postcode).trim() : undefined,
  });

  return res.status(201).json(withId(doc.toObject()));
}

