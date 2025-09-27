import { admin, db } from '../config/firebase.js';

export const setUserRole = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) return res.status(400).json({ message: 'email and role required' });

    const user = await admin.auth().getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await admin.auth().setCustomUserClaims(user.uid, { role });

    await db.collection('users').doc(user.uid).set({ role }, { merge: true });

    return res.json({ message: `Role updated to ${role} for ${email}`, uid: user.uid });
  } catch (err) {
    console.error('setUserRole error', err);
    return res.status(500).json({ message: 'Failed to set role', error: err.message });
  }
};
