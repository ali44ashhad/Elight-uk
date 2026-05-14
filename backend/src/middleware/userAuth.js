import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const USER_JWT_SECRET = process.env.USER_JWT_SECRET || 'elite-user-secret-change-in-production';

export async function userAuthMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.slice(7);
  let decoded;
  try {
    decoded = jwt.verify(token, USER_JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  try {
    const user = await User.findById(decoded.userId).select('_id isActive').lean();
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    if (user.isActive === false) {
      return res.status(403).json({ error: 'Account deactivated' });
    }
    req.userId = user._id.toString();
    next();
  } catch (err) {
    next(err);
  }
}

export { USER_JWT_SECRET };

