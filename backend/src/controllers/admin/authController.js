import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../../models/Admin.js';
import { JWT_SECRET } from '../../middleware/auth.js';

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const admin = await Admin.findOne({ email: String(email).trim() });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ adminId: admin._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, admin: { id: admin._id, email: admin.email } });
}

export async function me(req, res) {
  const admin = await Admin.findById(req.adminId).select('email');
  if (!admin) return res.status(404).json({ error: 'Admin not found' });
  res.json({ id: admin._id, email: admin.email });
}

