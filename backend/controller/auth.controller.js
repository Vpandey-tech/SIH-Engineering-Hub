import { auth, db } from '../config/firebase.js';
// import { doc, deleteDoc } from "firebase/firestore";
import { transporter } from '../config/mailer.js';
import { validateEmailDomain } from './email.controller.js'; // keep your helper here

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ message: 'Email, password and name are required' });

    await validateEmailDomain(email);

    try {
      await auth.getUserByEmail(email);
      return res.status(400).json({ message: 'Email already registered' });
    } catch (e) {
      if (e.code !== 'auth/user-not-found') throw e;
    }

    const user = await auth.createUser({ email, password, displayName: name });
    const link = await auth.generateEmailVerificationLink(email);

    await transporter.sendMail({
      from: '"Engineering Hub" <engineeringhub0001@gmail.com>',
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Hello ${name}, click <a href="${link}">here</a> to verify.</p>`
    });

    res.status(201).json({ message: 'Signup successful, check email', userId: user.uid });
  } catch (err) {
    res.status(400).json({ message: 'Signup failed', error: err.message });
  }
};

// ✅ Resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const link = await auth.generateEmailVerificationLink(email);

    await transporter.sendMail({
      from: '"Engineering Hub" <engineeringhub0001@gmail.com>',
      to: email,
      subject: 'Verify Your Email (Resend)',
      html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`
    });

    res.json({ message: 'Verification email resent successfully' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Failed to resend verification email', error: error.message });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Make sure user exists
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord.emailVerified) {
      return res.status(400).json({ message: 'Email not verified. Please verify first.' });
    }

    // Track login in Firestore
    await db.collection('loggedInUsers').doc(userRecord.uid).set({
      email: userRecord.email,
      name: userRecord.displayName || '',
      lastLogin: new Date()
    });

    res.json({ message: 'Login successful', user: userRecord });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// ✅ Logout
export const logout = async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ message: 'User UID is required' });

    await db.collection('loggedInUsers').doc(uid).delete();
    // await deleteDoc(doc(db, "loggedInUsers", uid));
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

// ✅ Verify ID token
export const verifyToken = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    const decoded = await auth.verifyIdToken(token);
    res.json({ message: 'Token is valid', uid: decoded.uid, email: decoded.email });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

// ✅ Get all currently logged-in users
export const getLoggedInUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('loggedInUsers').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error('Fetch logged-in users error:', error);
    res.status(500).json({ message: 'Failed to fetch logged-in users', error: error.message });
  }
};

