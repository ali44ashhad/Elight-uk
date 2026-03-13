import multer from 'multer';
import { cloudinary } from '../../lib/cloudinary.js';
import { Property } from '../../models/Property.js';
import { parsePagination } from '../../utils/pagination.js';
import { withId } from '../../utils/mapId.js';

export async function createProperty(req, res) {
  const {
    title,
    location,
    monthlyRent,
    expectedProfit,
    roi,
    investmentAmount,
    tenancyDetails,
    details,
    status = 'Available',
    sellerId,
  } = req.body;

  if (!title || !location || monthlyRent == null || investmentAmount == null) {
    return res.status(400).json({ error: 'Title, location, monthlyRent and investmentAmount required' });
  }

  const payload = {
    title: String(title).trim(),
    location: String(location).trim(),
    monthlyRent: Number(monthlyRent),
    expectedProfit: expectedProfit != null ? Number(expectedProfit) : undefined,
    roi: roi != null ? Number(roi) : undefined,
    investmentAmount: Number(investmentAmount),
    tenancyDetails: tenancyDetails != null ? String(tenancyDetails).trim() : undefined,
    details: details != null ? String(details).trim() || undefined : undefined,
    status: status === 'UnderOffer' || status === 'Sold' ? status : 'Available',
  };
  if (sellerId !== undefined && sellerId !== null && sellerId !== '') payload.seller = sellerId;
  else payload.seller = null;

  const property = await Property.create(payload);
  const populated = await Property.findById(property._id).populate('seller').lean();
  res.status(201).json(withId(populated));
}

export async function listAdminProperties(req, res) {
  const pagination = parsePagination(req.query);
  const base = Property.find().sort({ statusRank: 1, createdAt: -1 }).populate('seller');

  if (!pagination) {
    const properties = await base.lean();
    return res.json(withId(properties));
  }

  const [total, data] = await Promise.all([
    Property.countDocuments(),
    base.skip(pagination.skip).limit(pagination.limit).lean(),
  ]);

  return res.json({
    data: withId(data),
    pagination: { ...pagination, total, pages: Math.ceil(total / pagination.limit) },
  });
}

export async function getAdminProperty(req, res) {
  const property = await Property.findById(req.params.id).populate('seller').lean();
  if (!property) return res.status(404).json({ error: 'Property not found' });
  res.json(withId(property));
}

export async function updateProperty(req, res) {
  const id = req.params.id;
  const {
    title,
    location,
    monthlyRent,
    expectedProfit,
    roi,
    investmentAmount,
    tenancyDetails,
    details,
    status,
    sellerId,
  } = req.body;

  const data = {};
  if (title !== undefined) data.title = String(title).trim();
  if (location !== undefined) data.location = String(location).trim();
  if (monthlyRent !== undefined) data.monthlyRent = Number(monthlyRent);
  if (expectedProfit !== undefined) data.expectedProfit = expectedProfit == null ? null : Number(expectedProfit);
  if (roi !== undefined) data.roi = roi == null ? null : Number(roi);
  if (investmentAmount !== undefined) data.investmentAmount = Number(investmentAmount);
  if (tenancyDetails !== undefined) data.tenancyDetails = tenancyDetails == null ? null : String(tenancyDetails).trim();
  if (details !== undefined) data.details = details == null ? null : String(details).trim();
  if (status !== undefined) data.status = status;
  if (sellerId !== undefined) data.seller = sellerId === null || sellerId === '' ? null : sellerId;

  const property = await Property.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('seller');
  if (!property) return res.status(404).json({ error: 'Property not found' });
  res.json(withId(property.toObject()));
}

export async function deleteProperty(req, res) {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ error: 'Property not found' });

  for (const img of property.images || []) {
    if (img.publicId) {
      try {
        await cloudinary.uploader.destroy(img.publicId, { invalidate: true });
      } catch (e) {
        // don't fail delete if image cleanup fails
        console.error('[cloudinary.destroy]', e);
      }
    }
  }

  await property.deleteOne();
  res.status(204).send();
}

function ensureCloudinaryConfigured() {
  if (!process.env.CLOUDINARY_URL && !(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)) {
    const err = new Error('Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.');
    err.statusCode = 500;
    throw err;
  }
}

export const uploadImagesMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 20 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) return cb(null, true);
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'images'));
  },
}).array('images', 20);

async function uploadBufferToCloudinary({ buffer, folder }) {
  ensureCloudinaryConfigured();
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function uploadPropertyImages(req, res) {
  const propertyId = req.params.id;
  const property = await Property.findById(propertyId);
  if (!property) return res.status(404).json({ error: 'Property not found' });

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
  await property.save();

  res.status(201).json(withId(property.toObject()).images);
}

export async function deletePropertyImage(req, res) {
  const { propertyId, imageId } = req.params;
  const property = await Property.findById(propertyId);
  if (!property) return res.status(404).json({ error: 'Property not found' });

  const img = property.images.id(imageId);
  if (!img) return res.status(404).json({ error: 'Image not found' });

  if (img.publicId) {
    await cloudinary.uploader.destroy(img.publicId, { invalidate: true });
  }
  img.deleteOne();
  await property.save();

  res.status(204).send();
}

