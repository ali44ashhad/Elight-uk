import { Property } from '../models/Property.js';
import { Seller } from '../models/Seller.js';
import { User } from '../models/User.js';
import { withId } from '../utils/mapId.js';
import multer from 'multer';
import { cloudinary } from '../lib/cloudinary.js';

async function requireApprovedProvider(userId) {
  const user = await User.findById(userId).select('providerStatus isActive').lean();
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  if (user.isActive === false) {
    const err = new Error('Account deactivated');
    err.statusCode = 403;
    throw err;
  }
  if (user.providerStatus !== 'approved') {
    const err = new Error('Provider not approved');
    err.statusCode = 403;
    throw err;
  }
}

export async function listMyProviderProperties(req, res) {
  const userId = req.userId;
  await requireApprovedProvider(userId);

  const properties = await Property.find({ createdByUser: userId })
    .sort({ createdAt: -1 })
    .populate('seller', 'name imageUrl')
    .lean();

  res.json(withId(properties));
}

export async function getMyProviderProperty(req, res) {
  const userId = req.userId;
  await requireApprovedProvider(userId);

  const id = req.params.id;
  const property = await Property.findOne({ _id: id, createdByUser: userId })
    .populate('seller', 'name imageUrl')
    .lean();

  if (!property) return res.status(404).json({ error: 'Property not found' });
  res.json(withId(property));
}

export async function createProviderProperty(req, res) {
  const userId = req.userId;
  await requireApprovedProvider(userId);

  const seller = await Seller.findOne({ user: userId }).select('_id').lean();

  const {
    title,
    location,
    monthlyRent,
    billsAmount,
    expectedProfit,
    roi,
    investmentAmount,
    tenancyDetails,
    details,
    highlights,
  } = req.body || {}; 

  if (!title || !location || monthlyRent == null || investmentAmount == null) {
    return res.status(400).json({ error: 'Title, location, monthlyRent and investmentAmount required' });
  }

  const payload = {
    title: String(title).trim(),
    location: String(location).trim(),
    monthlyRent: Number(monthlyRent),
    billsAmount: billsAmount != null && billsAmount !== '' ? Number(billsAmount) : undefined,
    expectedProfit: expectedProfit != null ? Number(expectedProfit) : undefined,
    roi: roi != null ? Number(roi) : undefined,
    investmentAmount: Number(investmentAmount),
    tenancyDetails: tenancyDetails != null ? String(tenancyDetails).trim() : undefined,
    details: details != null ? String(details).trim() || undefined : undefined,
    highlights: Array.isArray(highlights)
      ? highlights
          .map((x) => (x == null ? '' : String(x).trim()))
          .filter(Boolean)
          .slice(0, 10)
      : [],
    status: 'Available',
    moderationStatus: 'pending',
    createdByUser: userId,
    seller: seller?._id || null,
  };

  const property = await Property.create(payload);
  const populated = await Property.findById(property._id).populate('seller', 'name imageUrl').lean();
  res.status(201).json(withId(populated));
}

export async function updateProviderProperty(req, res) {
  const userId = req.userId;
  await requireApprovedProvider(userId);

  const id = req.params.id;
  const property = await Property.findOne({ _id: id, createdByUser: userId });
  if (!property) return res.status(404).json({ error: 'Property not found' });

  const currentModeration = property.moderationStatus || 'pending';
  if (currentModeration !== 'pending' && currentModeration !== 'approved' && currentModeration !== 'rejected') {
    return res.status(409).json({ error: 'Property cannot be edited in its current state' });
  }

  const {
    title,
    location,
    monthlyRent,
    billsAmount,
    expectedProfit,
    roi,
    investmentAmount,
    tenancyDetails,
    details,
    highlights,
  } = req.body || {};

  if (title !== undefined) property.title = String(title).trim();
  if (location !== undefined) property.location = String(location).trim();
  if (monthlyRent !== undefined) property.monthlyRent = Number(monthlyRent);
  if (billsAmount !== undefined) property.billsAmount = billsAmount == null || billsAmount === '' ? null : Number(billsAmount);
  if (expectedProfit !== undefined) property.expectedProfit = expectedProfit == null ? null : Number(expectedProfit);
  if (roi !== undefined) property.roi = roi == null ? null : Number(roi);
  if (investmentAmount !== undefined) property.investmentAmount = Number(investmentAmount);
  if (tenancyDetails !== undefined)
    property.tenancyDetails = tenancyDetails == null ? null : String(tenancyDetails).trim();
  if (details !== undefined) property.details = details == null ? null : String(details).trim();
  if (highlights !== undefined) {
    property.highlights = Array.isArray(highlights)
      ? highlights
          .map((x) => (x == null ? '' : String(x).trim()))
          .filter(Boolean)
          .slice(0, 10)
      : [];
  }

  // If a rejected property is edited, it should go back to admin review.
  if (currentModeration === 'rejected') {
    property.moderationStatus = 'pending';
  }

  await property.save();
  const populated = await Property.findById(property._id).populate('seller', 'name imageUrl').lean();
  res.json(withId(populated));
}

function ensureCloudinaryConfigured() {
  if (
    !process.env.CLOUDINARY_URL &&
    !(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  ) {
    const err = new Error('Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.');
    err.statusCode = 500;
    throw err;
  }
}

export const uploadProviderImagesMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) return cb(null, true);
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'images'));
  },
}).array('images', 10);

async function uploadBufferToCloudinary({ buffer, folder }) {
  ensureCloudinaryConfigured();
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

export async function uploadProviderPropertyImages(req, res) {
  const userId = req.userId;
  await requireApprovedProvider(userId);

  const propertyId = req.params.id;
  const property = await Property.findOne({ _id: propertyId, createdByUser: userId });
  if (!property) return res.status(404).json({ error: 'Property not found' });
  const currentModeration = property.moderationStatus || 'pending';
  if (currentModeration !== 'pending' && currentModeration !== 'approved' && currentModeration !== 'rejected') {
    return res.status(409).json({ error: 'Images cannot be uploaded in the current state' });
  }

  const files = Array.isArray(req.files) ? req.files : [];
  if (files.length === 0) return res.status(400).json({ error: 'No images uploaded' });

  const folder = process.env.CLOUDINARY_FOLDER || 'elite/properties';

  const currentMaxOrder = property.images.reduce((m, img) => Math.max(m, img.order || 0), -1);
  const startOrder = currentMaxOrder + 1;

  const uploaded = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const result = await uploadBufferToCloudinary({ buffer: f.buffer, folder: `${folder}/${propertyId}` });
    uploaded.push({
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      order: startOrder + i,
    });
  }

  property.images.push(...uploaded);

  // If a rejected property gets new images, treat it as a resubmission.
  if (currentModeration === 'rejected') {
    property.moderationStatus = 'pending';
  }

  await property.save();

  res.status(201).json(withId(property.toObject()).images);
}

export async function deleteProviderPropertyImage(req, res) {
  const userId = req.userId;
  await requireApprovedProvider(userId);

  const { propertyId, imageId } = req.params;
  const property = await Property.findOne({ _id: propertyId, createdByUser: userId });
  if (!property) return res.status(404).json({ error: 'Property not found' });

  const img = property.images.id(imageId);
  if (!img) return res.status(404).json({ error: 'Image not found' });

  if (img.publicId) {
    try {
      await cloudinary.uploader.destroy(img.publicId, { invalidate: true });
    } catch (e) {
      console.error('[cloudinary.destroy provider image]', e);
    }
  }

  img.deleteOne();

  // If a rejected property is modified (image removal), resubmit for admin review.
  if ((property.moderationStatus || 'pending') === 'rejected') {
    property.moderationStatus = 'pending';
  }

  await property.save();
  res.status(204).send();
}

