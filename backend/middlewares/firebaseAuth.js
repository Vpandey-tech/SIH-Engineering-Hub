// // import { auth, db } from '../config/firebase.js'; // adapt names to your config

// // export const verifyFirebaseToken = async (req, res, next) => {
// //   try {
// //     const header = req.headers.authorization || '';
// //     if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing Authorization token' });
// //     const idToken = header.split(' ')[1];
// //     const decoded = await auth.verifyIdToken(idToken);
// //     // decoded contains uid, email, and custom claims
// //     req.user = decoded;
// //     next();
// //   } catch (err) {
// //     console.error('verifyFirebaseToken error:', err);
// //     return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
// //   }
// // };

// // // isAdmin: check custom claim OR Firestore users doc role
// // export const requireAdmin = async (req, res, next) => {
// //   try {
// //     if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

// //     // 1) quick check: custom claim
// //     if (req.user.admin === true) return next();

// //     // 2) fallback: check role in Firestore user doc (collection 'users')
// //     const uid = req.user.uid;
// //     const userDoc = await db.collection('users').doc(uid).get();
// //     if (userDoc.exists && userDoc.data()?.role === 'admin') return next();

// //     return res.status(403).json({ message: 'Not authorized (admin only)' });
// //   } catch (err) {
// //     console.error('requireAdmin error:', err);
// //     return res.status(500).json({ message: 'Server error', error: err.message });
// //   }
// // };

// import { auth, db } from '../config/firebase.js';

// export const verifyFirebaseToken = async (req, res, next) => {
//   try {
//     const header = (req.headers.authorization || '').trim();
//     if (!header || !header.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Missing Authorization token' });
//     }

//     const idToken = header.split(' ')[1];
//     const decoded = await auth.verifyIdToken(idToken);

//     const uid = decoded.uid;
//     const email = decoded.email || null;

//     let role = decoded.role || decoded?.claims?.role || 'student';
//     let name = '';

//     try {
//       const userDoc = await db.collection('users').doc(uid).get();
//       if (userDoc.exists) {
//         role = userDoc.data()?.role || role;
//         name = userDoc.data()?.name || userDoc.data()?.displayName || '';
//       }
//     } catch (e) {
//       console.warn('Failed to fetch user document', e);
//     }

//     const isAdmin = role === 'admin' || decoded.admin === true;

//     req.user = { uid, email, role, name, claims: decoded, isAdmin };
//     return next();
//   } catch (err) {
//     console.error('verifyFirebaseToken error:', err);
//     return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
//   }
// };

// export const requireAdmin = (req, res, next) => {
//   if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
//   if (req.user.role !== 'admin' && !req.user.isAdmin) {
//     return res.status(403).json({ message: 'Forbidden - admin only' });
//   }
//   return next();
// };
