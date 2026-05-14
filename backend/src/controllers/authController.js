import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { cloudinary } from '../lib/cloudinary.js';
import { User } from '../models/User.js';
import { Seller } from '../models/Seller.js';
import { USER_JWT_SECRET } from '../middleware/userAuth.js';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export async function register(req, res) {
  const { name, email, password } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!normalizedEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = await User.findOne({ email: normalizedEmail }).select('_id').lean();
  if (existing) {
    return res.status(409).json({ error: 'Email already in use' });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
  });

  const token = jwt.sign({ userId: user._id.toString() }, USER_JWT_SECRET, { expiresIn: '30d' });
  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      providerStatus: user.providerStatus,
      isActive: true,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  if (user.isActive === false) {
    return res.status(403).json({ error: 'This account has been deactivated. Please contact support.' });
  }

  const token = jwt.sign({ userId: user._id.toString() }, USER_JWT_SECRET, { expiresIn: '30d' });
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      providerStatus: user.providerStatus,
      isActive: user.isActive !== false,
    },
  });
}

export async function me(req, res) {
  const user = await User.findById(req.userId)
    .select('name email providerStatus imageUrl preferences isActive')
    .lean();
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    providerStatus: user.providerStatus,
    imageUrl: user.imageUrl,
    preferences: user.preferences || {},
    isActive: user.isActive !== false,
  });
}

export async function updateMe(req, res) {
  const { name, preferences } = req.body || {};
  const data = {};

  if (name !== undefined) {
    const n = String(name || '').trim();
    if (!n) return res.status(400).json({ error: 'Name cannot be empty' });
    data.name = n;
  }

  if (preferences !== undefined && preferences && typeof preferences === 'object') {
    const next = {};
    if (preferences.emailUpdates !== undefined) next['preferences.emailUpdates'] = !!preferences.emailUpdates;
    if (preferences.whatsappUpdates !== undefined) next['preferences.whatsappUpdates'] = !!preferences.whatsappUpdates;
    if (preferences.hideSoldProperties !== undefined) next['preferences.hideSoldProperties'] = !!preferences.hideSoldProperties;
    Object.assign(data, next);
  }

  const user = await User.findByIdAndUpdate(req.userId, data, { new: true, runValidators: true })
    .select('name email providerStatus imageUrl preferences isActive')
    .lean();
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    providerStatus: user.providerStatus,
    imageUrl: user.imageUrl,
    preferences: user.preferences || {},
    isActive: user.isActive !== false,
  });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword required' });
  }
  if (String(newPassword).length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const ok = await bcrypt.compare(String(currentPassword), user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid current password' });

  user.passwordHash = await bcrypt.hash(String(newPassword), 10);
  await user.save();
  res.json({ ok: true });
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

export const uploadUserImageMiddleware = multer({
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
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

export async function uploadMeImage(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No image uploaded' });

  const folder = process.env.CLOUDINARY_FOLDER || 'elite/users';

  if (user.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(user.imagePublicId, { invalidate: true });
    } catch (e) {
      console.error('[cloudinary.destroy user]', e);
    }
  }

  const result = await uploadBufferToCloudinary({ buffer: file.buffer, folder: `${folder}/${user._id}` });
  user.imagePublicId = result.public_id;
  user.imageUrl = result.secure_url || result.url || user.imageUrl;
  await user.save();

  // If this user is an approved provider, keep their public Seller profile image in sync.
  try {
    await Seller.findOneAndUpdate(
      { user: user._id },
      { imagePublicId: user.imagePublicId, imageUrl: user.imageUrl },
      { new: false }
    );
  } catch (e) {
    // Don't fail avatar upload if seller sync fails.
    console.error('[seller.sync avatar]', e);
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    providerStatus: user.providerStatus,
    imageUrl: user.imageUrl,
    preferences: user.preferences || {},
    isActive: user.isActive !== false,
  });
}

