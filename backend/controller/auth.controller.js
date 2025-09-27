import { auth, db, admin } from '../config/firebase.js';
import nodemailer from 'nodemailer';

const transporter = (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'name, email, password required' });

    const finalRole = 'student';

    const userRecord = await auth.createUser({ email, password, displayName: name });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: finalRole });

    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      role: finalRole,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const verificationLink = await auth.generateEmailVerificationLink(email);

    if (transporter) {
      const mailOptions = {
        from: process.env.SMTP_FROM || '"Engineering Hub" <no-reply@engineeringhub>',
        to: email,
        subject: 'Verify your Engineering Hub account',
        text: `Hello ${name},\nPlease verify your email: ${verificationLink}`,
        html: `<p>Hello ${name},</p><p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`
      };
      await transporter.sendMail(mailOptions);
      return res.status(201).json({ message: 'Signup successful. Verification email sent.', uid: userRecord.uid, role: finalRole });
    } else {
      return res.status(201).json({ message: 'Signup successful (dev). No SMTP configured — verification link returned.', uid: userRecord.uid, role: finalRole, verificationLink });
    }
  } catch (err) {
    console.error('signup error', err);
    if (err.code === 'auth/email-already-exists' || err.message?.includes('already exists')) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'email required' });

    const userRecord = await auth.getUserByEmail(email);
    if (userRecord.emailVerified) return res.status(400).json({ message: 'Email already verified' });

    const link = await auth.generateEmailVerificationLink(email);

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Engineering Hub" <no-reply@engineeringhub>',
        to: email,
        subject: 'Verify your Engineering Hub account',
        text: `Please verify: ${link}`,
        html: `<p>Please verify your email by clicking <a href="${link}">this link</a>.</p>`
      });
      return res.json({ message: 'Verification resent' });
    } else {
      return res.json({ message: 'Verification link (dev)', link });
    }
  } catch (err) {
    console.error('resendVerification', err);
    return res.status(500).json({ message: 'Failed to resend verification', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'email required' });

    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord.emailVerified) return res.status(403).json({ message: 'Please verify your email' });

    await db.collection('loggedInUsers').doc(userRecord.uid).set({
      email: userRecord.email,
      name: userRecord.displayName || '',
      loginTime: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ message: 'OK', uid: userRecord.uid });
  } catch (err) {
    console.error('login error', err);
    if (err.code === 'auth/user-not-found' || /no user record/u.test(err.message || '')) {
      return res.status(400).json({ message: 'Please register first' });
    }
    return res.status(400).json({ message: 'Login failed', error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ message: 'User UID is required' });
    await db.collection('loggedInUsers').doc(uid).delete();
    return res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('logout error', err);
    return res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

export const me = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const uid = req.user.uid;
    const userDoc = await db.collection('users').doc(uid).get();
    const profile = userDoc.exists ? userDoc.data() : null;
    const claims = req.user.claims || {};
    const role = claims.role || (profile?.role) || 'student';
    return res.json({ uid, email: req.user.email, role, profile });
  } catch (err) {
    console.error('me error', err);
    return res.status(500).json({ message: 'Failed', error: err.message });
  }
};

export const getLoggedInUsers = async (req, res) => {
  try {
    const snap = await db.collection('loggedInUsers').get();
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed', error: err.message });
  }
};
