import multer from 'multer';
import { cloudinary } from '../../lib/cloudinary.js';
import { Seller } from '../../models/Seller.js';
import { withId } from '../../utils/mapId.js';

export async function listSellers(req, res) {
  const sellers = await Seller.find().sort({ name: 1 }).lean();
  res.json(withId(sellers));
}

export async function createSeller(req, res) {
  const { name } = req.body;
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const seller = await Seller.create({
    name: String(name).trim(),
  });
  res.status(201).json(withId(seller.toObject()));
}

export async function getSeller(req, res) {
  const seller = await Seller.findById(req.params.id).lean();
  if (!seller) return res.status(404).json({ error: 'Seller not found' });
  res.json(withId(seller));
}

export async function updateSeller(req, res) {
  const { name } = req.body;
  const data = {};
  if (name !== undefined) data.name = String(name).trim();
  const seller = await Seller.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!seller) return res.status(404).json({ error: 'Seller not found' });
  res.json(withId(seller.toObject()));
}

export async function deleteSeller(req, res) {
  const seller = await Seller.findByIdAndDelete(req.params.id);
  if (!seller) return res.status(404).json({ error: 'Seller not found' });
  res.status(204).send();
}

function ensureCloudinaryConfigured() {
  if (
    !process.env.CLOUDINARY_URL &&
    !(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  ) {
    const err = new Error(
      'Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.'
    );
    err.statusCode = 500;
    throw err;
  }
}

export const uploadSellerImageMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) return cb(null, true);
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'image'));
  },
}).single('image');

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

export async function uploadSellerImage(req, res) {
  const id = req.params.id;
  const seller = await Seller.findById(id);
  if (!seller) return res.status(404).json({ error: 'Seller not found' });

  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No image uploaded' });

  const folder = process.env.CLOUDINARY_FOLDER || 'elite/sellers';

  // Delete previous image if exists
  if (seller.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(seller.imagePublicId, { invalidate: true });
    } catch (e) {
      // don't fail upload if cleanup fails
      console.error('[cloudinary.destroy seller]', e);
    }
  }

  const result = await uploadBufferToCloudinary({ buffer: file.buffer, folder: `${folder}/${id}` });

  seller.imagePublicId = result.public_id;
  seller.imageUrl = result.secure_url || result.url || seller.imageUrl;
  await seller.save();

  res.status(200).json(withId(seller.toObject()));
}
