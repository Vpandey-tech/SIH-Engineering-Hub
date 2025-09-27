// backend/routes/user.routes.js
import { Router } from 'express';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';
import { db } from '../config/firebase.js';
const router = Router();

router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return res.json({ role: 'student' });
    return res.json({ role: doc.data().role || 'student', ...doc.data() });
  } catch (err) {
    return res.status(500).json({ message: 'Failed', error: err.message });
  }
});

export default router;
