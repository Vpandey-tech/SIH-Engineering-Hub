import { auth, db } from '../config/firebase.js';

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const header = (req.headers.authorization || '').trim();
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing Authorization token' });
    }

    const idToken = header.split(' ')[1];
    const decoded = await auth.verifyIdToken(idToken);

    const uid = decoded.uid;
    const email = decoded.email || null;

    let role = decoded.role || decoded?.claims?.role || 'student';
    let name = '';

    try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) {
        role = userDoc.data()?.role || role;
        name = userDoc.data()?.name || userDoc.data()?.displayName || '';
      }
    } catch (e) {
      console.warn('Failed to fetch user document', e);
    }

    const isAdmin = role === 'admin' || decoded.admin === true;

    req.user = { uid, email, role, name, claims: decoded, isAdmin };
    return next();
  } catch (err) {
    console.error('verifyFirebaseToken error:', err);
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'admin' && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden - admin only' });
  }
  return next();
};
