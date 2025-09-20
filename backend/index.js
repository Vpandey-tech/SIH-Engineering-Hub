// import express from 'express';
// import cors from 'cors';
// import admin from 'firebase-admin';
// import { readFile } from 'fs/promises';
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// // import rateLimit from 'express-rate-limit';
// import geminiRoutes from './routes/geminiRoutes.js';
// import { validateEmailDomain, resendLimiter, signupLimiter } from './controller/email.controller.js';
// // Load environment variables
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Rate limiter for /api/signup (300 requests/day/IP)
// // const signupLimiter = rateLimit({
// //   windowMs: 24 * 60 * 60 * 1000, // 24 hours
// //   max: 300, // 300 requests per IP
// //   message: { message: 'Too many signup attempts from this IP. Please try again tomorrow.' },
// //   standardHeaders: true,
// //   legacyHeaders: false,
// // });

// // Rate limiter for /api/resend-verification (5 requests/5 minutes/IP)
// // const resendLimiter = rateLimit({
// //   windowMs: 5 * 60 * 1000, // 5 minutes
// //   max: 5, // 5 requests per IP
// //   message: { message: 'Too many resend attempts. Please try again in 5 minutes.' },
// //   standardHeaders: true,
// //   legacyHeaders: false,
// // });

// // Load service account key
// let serviceAccount;
// try {
//   const serviceAccountData = await readFile(new URL('./serviceAccountKey.json', import.meta.url), 'utf8');
//   serviceAccount = JSON.parse(serviceAccountData);
// } catch (error) {
//   console.error('Error loading serviceAccountKey.json:', error.message);
//   process.exit(1);
// }

// // Initialize Firebase Admin
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const auth = admin.auth();
// const db = admin.firestore();

// // Initialize nodemailer transporter for Brevo
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: process.env.SMTP_SECURE === 'true',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // Verify transporter on startup
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('SMTP connection error:', error.message);
//   } else {
//     console.log('SMTP connection verified');
//   }
// });

// // Trusted email domains
// // const trustedDomains = [
// //   'gmail.com',
// //   'yahoo.com',
// //   'outlook.com',
// //   'hotmail.com',
// //   'icloud.com',
// // ];

// // Validate email domain
// // const validateEmailDomain = async (email) => {
// //   const domain = email.split('@')[1];
// //   if (!trustedDomains.includes(domain)) {
// //     throw new Error('Email domain not trusted. Please use a Gmail, Yahoo, Outlook, Hotmail, or iCloud email.');
// //   }
// //   try {
// //     const mxRecords = await dns.resolveMx(domain);
// //     if (!mxRecords || mxRecords.length === 0) {
// //       throw new Error('Invalid email domain. Please use a valid email address.');
// //     }
// //     return true;
// //   } catch (error) {
// //     throw new Error('Invalid email domain. Please use a valid email address.');
// //   }
// // };

// // Resources data
// const resourcesData = {
//   "First Year": {
//     Syllabus: [
//       { name: "Syllabus Folder", url: "https://drive.google.com/drive/u/2/folders/1-jxLKfK72lmU2fSUYMtvrl6dlpkIclPs" },
//     ],
//     Pyq: {
//       Sem1: "https://drive.google.com/drive/u/2/folders/10BI1nHg1mTeDYrREZz28DAcrHvHu5y-2",
//       Sem2: "https://drive.google.com/drive/u/2/folders/10Cr5_12J4Y_YBo92_PBX3SB3xwkBlGjs",
//       Sem3: "",
//       Sem4: "",
//       Sem5: "",
//       Sem6: "",
//       Sem7: "",
//       Sem8: "",
//     },
//     MostImportant: {
//       Sem1: "https://drive.google.com/drive/u/2/folders/10BI1nHg1mTeDYrREZz28DAcrHvHu5y-2", // Paste your Drive link for Sem 1 and Sem 2 here
//       Sem2: "YOUR_DRIVE_LINK_HERE", // Same link as Sem 1
//       Sem3: "",
//       Sem4: "",
//       Sem5: "",
//       Sem6: "",
//       Sem7: "",
//       Sem8: "",
//     },
//   },
//   "Mechanical": {
//     Syllabus: [
//       { name: "Syllabus Folder - Sem 3", url: "https://drive.google.com/drive/u/2/folders/12agsJKmWnAv_jXxVikzXSYLioxUKkF2r" },
//       { name: "Syllabus Folder - Sem 4", url: "https://drive.google.com/drive/u/2/folders/12u3yWykQ3rhgCnADW6GFBIETicSsU2rv" },
//       { name: "Syllabus Folder - Sem 5", url: "https://drive.google.com/drive/u/2/folders/13j4ca7d5ep1gFrphlT5T5xW8M25rPE9p" },
//       { name: "Syllabus Folder - Sem 6", url: "https://drive.google.com/drive/u/2/folders/14AFbqqZYLVC4XkSzexAGQRaNG7tQyvwI" },
//       { name: "Syllabus Folder - Sem 7", url: "https://drive.google.com/drive/u/2/folders/11iUWFt8ZdmkACXJh1fYTSe7sE2RtPcnL" },
//       { name: "Syllabus Folder - Sem 8", url: "https://drive.google.com/drive/u/2/folders/11xEkvHQh3jToOgok_QfXbvljITLO5dmF" },
//     ],
//     Pyq: {
//       Sem3: "https://drive.google.com/drive/u/2/folders/12Lkn7SaoROQRHz7AQ4ZTDEY44h9iSABY",
//       Sem4: "https://drive.google.com/drive/u/2/folders/12kCL0KpM9aJWWGKwVuQdQus7mx7jKL7K",
//       Sem5: "https://drive.google.com/drive/u/2/folders/13bXy50wtYgGHdeK9AlfQPK1GamzrYjYv",
//       Sem6: "https://drive.google.com/drive/u/2/folders/13yzRHhzdgsk3KFV7Sy1QB_Bi73NtgHUd",
//       Sem7: "https://drive.google.com/drive/u/2/folders/11b1eBQDsNqnhX2a6123-BEZEF_6ZVWpA",
//       Sem8: "https://drive.google.com/drive/u/2/folders/11p5fIABmNiGryl3X-7jVpiRo9ZDZix0q",
//     },
//     MostImportant: {
//       Sem1: "YOUR_DRIVE_LINK_HERE", // Paste your Drive link for Sem 1 and Sem 2 here
//       Sem2: "YOUR_DRIVE_LINK_HERE", // Same link as Sem 1
//       Sem3: "",
//       Sem4: "",
//       Sem5: "",
//       Sem6: "",
//       Sem7: "",
//       Sem8: "",
//     },
//   },
//   "Computer Engineering": {
//     Syllabus: [
//       { name: "Syllabus Folder - Sem 3", url: "https://drive.google.com/drive/u/2/folders/11zQP05pCbPjCx5rP6xgdZgkquz8EJ6yf" },
//       { name: "Syllabus Folder - Sem 4", url: "https://drive.google.com/drive/u/2/folders/1N6pUJNMHOpDo9PFbEg-Vdzu5zgFAhefa" },
//       { name: "Syllabus Folder - Sem 5", url: "https://drive.google.com/drive/u/2/folders/1NGhP8k228gPLv7iEDjRo6u5CFqyPFAjH" },
//       { name: "Syllabus Folder - Sem 6", url: "https://drive.google.com/drive/u/2/folders/1NIIjZ0egzLujfrr9e_qTrxuxriLhqEu4" },
//       { name: "Syllabus Folder - Sem 7", url: "https://drive.google.com/drive/u/2/folders/1PydwRa6dWzR5brHUv6H3tqqaiFnEb3oH" },
//       { name: "Syllabus Folder - Sem 8", url: "https://drive.google.com/drive/u/2/folders/1QD5UbevNNeJwdlPzhs0QPjxEQiCL1O1w" },
//     ],
//     Pyq: {
//       Sem3: "https://drive.google.com/drive/u/2/folders/11xO30eGebuP00S-7BhblNgZWo9VZ86He",
//       Sem4: "https://drive.google.com/drive/u/2/folders/1MxKmUm5v2I0ccJ_mNIVz5rrZGcagCsNz",
//       Sem5: "https://drive.google.com/drive/u/2/folders/1N8KxpCFW00yJz4qHR4KyDdjPSUfAiQu2",
//       Sem6: "https://drive.google.com/drive/u/2/folders/1NHYG16Lgsr3LwezoKfz0VuD7bEBcaV3P",
//       Sem7: "https://drive.google.com/drive/u/2/folders/1PvWdl0qLnIkwLZvRTrpcCyoV4DBKcArS",
//       Sem8: "https://drive.google.com/drive/u/2/folders/1Q29fVOLwJoMMTxzD0yrLhK1sx-oEnBEp",
//     },
//     MostImportant: {
//       Sem1: "YOUR_DRIVE_LINK_HERE", // Paste your Drive link for Sem 1 and Sem 2 here
//       Sem2: "YOUR_DRIVE_LINK_HERE", // Same link as Sem 1
//       Sem3: "",
//       Sem4: "",
//       Sem5: "",
//       Sem6: "",
//       Sem7: "",
//       Sem8: "",
//     },
//   },
//   "IT": {
//     Syllabus: [
//       { name: "Syllabus Folder - Sem 3", url: "https://drive.google.com/drive/u/2/folders/1ZKhcA91kjXSrrOrd7-EcCxQZzN9JX9En" },
//       { name: "Syllabus Folder - Sem 4", url: "https://drive.google.com/drive/u/2/folders/1ZoaNWKRcEVFcHBQkz7sByyFtmkSorBe7" },
//       { name: "Syllabus Folder - Sem 5", url: "https://drive.google.com/drive/u/2/folders/1_3iiPVUZ1E3tV5sZcjs4VuZR-9TtLaOa" },
//       { name: "Syllabus Folder - Sem 6", url: "https://drive.google.com/drive/u/2/folders/1_7qBttRq3JoEZl6Gt1lKxga0V887edM0" },
//       { name: "Syllabus Folder - Sem 7", url: "https://drive.google.com/drive/u/2/folders/1_NTka2KhrOkQGeWbAuNTnxyplgbrZ02G" },
//       { name: "Syllabus Folder - Sem 8", url: "https://drive.google.com/drive/u/2/folders/1__VLcindhL3_8R00tveK1xWTTgxWSqw4" },
//     ],
//     Pyq: {
//       Sem3: "https://drive.google.com/drive/u/2/folders/1ZJyOBxuesAj9-T6G5ailmX1Cd6_yZ9uB",
//       Sem4: "https://drive.google.com/drive/u/2/folders/1ZPOdIAAThO9-YDScr4tcNQIExsHtBqGY",
//       Sem5: "https://drive.google.com/drive/u/2/folders/1ZyhEgzGgqVoAJN-x6yduKp-_5nf4TnHq",
//       Sem6: "https://drive.google.com/drive/u/2/folders/1_6btSFhKSeT35LCXTOfaMiXT6X3IIACJ",
//       Sem7: "https://drive.google.com/drive/u/2/folders/1_MUYazZ0RVCIcwr07xiuyu4KY5XV__as",
//       Sem8: "https://drive.google.com/drive/u/2/folders/1_TaYcuQj2Ist23h_6KLbyaOj0fgStbxe",
//     },
//     MostImportant: {
//       Sem1: "YOUR_DRIVE_LINK_HERE", // Paste your Drive link for Sem 1 and Sem 2 here
//       Sem2: "YOUR_DRIVE_LINK_HERE", // Same link as Sem 1
//       Sem3: "",
//       Sem4: "",
//       Sem5: "",
//       Sem6: "",
//       Sem7: "",
//       Sem8: "",
//     },
//   },
//   "EXTC": {
//     Syllabus: [
//       { name: "Syllabus Folder - Sem 3", url: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM3" }, // Replace with actual URL
//       { name: "Syllabus Folder - Sem 4", url: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM4" }, // Replace with actual URL
//       { name: "Syllabus Folder - Sem 5", url: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM5" }, // Replace with actual URL
//       { name: "Syllabus Folder - Sem 6", url: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM6" }, // Replace with actual URL
//       { name: "Syllabus Folder - Sem 7", url: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM7" }, // Replace with actual URL
//       { name: "Syllabus Folder - Sem 8", url: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM8" }, // Replace with actual URL
//     ],
//     Pyq: {
//       Sem3: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM3_PYQ", // Replace with actual URL
//       Sem4: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM4_PYQ", // Replace with actual URL
//       Sem5: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM5_PYQ", // Replace with actual URL
//       Sem6: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM6_PYQ", // Replace with actual URL
//       Sem7: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM7_PYQ", // Replace with actual URL
//       Sem8: "https://drive.google.com/drive/u/2/folders/PLACEHOLDER_SEM8_PYQ", // Replace with actual URL
//     },
//     MostImportant: {
//       Sem1: "YOUR_DRIVE_LINK_HERE", // Paste your Drive link for Sem 1 and Sem 2 here
//       Sem2: "YOUR_DRIVE_LINK_HERE", // Same link as Sem 1
//       Sem3: "",
//       Sem4: "",
//       Sem5: "",
//       Sem6: "",
//       Sem7: "",
//       Sem8: "",
//     },
//   },
//   "CSE": {
//     Syllabus: [
//       { name: "Syllabus Folder - Sem 3", url: "https://drive.google.com/drive/u/2/folders/1R3tvWCBN1W_W0jRpR7UbRESyRxZ3wo9M" },
//       { name: "Syllabus Folder - Sem 4", url: "https://drive.google.com/drive/u/2/folders/1R5z05c4g_hwzajz7f2Pq8pTjNtt2Lc-r" },
//       { name: "Syllabus Folder - Sem 5", url: "https://drive.google.com/drive/u/2/folders/1YN7UmdSimT8GEorRj9A4lVGkkb_KAsxV" },
//       { name: "Syllabus Folder - Sem 6", url: "https://drive.google.com/drive/u/2/folders/1Yq259cCJArX0QYfRaJBKaG18QJijUel1" },
//       { name: "Syllabus Folder - Sem 7", url: "https://drive.google.com/drive/u/2/folders/1PydwRa6dWzR5brHUv6H3tqqaiFnEb3oH" }, // Using Sem 7 from Computer Engineering as placeholder
//       { name: "Syllabus Folder - Sem 8", url: "https://drive.google.com/drive/u/2/folders/1QD5UbevNNeJwdlPzhs0QPjxEQiCL1O1w" }, // Using Sem 8 from Computer Engineering as placeholder
//     ],
//     Pyq: {
//       Sem3: "https://drive.google.com/drive/u/2/folders/1R1koJUzAgz21nbg-kuFZiZMxZjInrnua",
//       Sem4: "https://drive.google.com/drive/u/2/folders/1R56yNvhdVoMRsUb5DCSSr2g9N2vZHQ-F",
//       Sem5: "https://drive.google.com/drive/u/2/folders/1YKrdf8ejxTyUuTbBtVhmJCuq4vZnDghb",
//       Sem6: "https://drive.google.com/drive/u/2/folders/1YUx4GvteM3zZWK-5RaZUKFA01cfM15t3",
//       Sem7: "https://drive.google.com/drive/u/2/folders/1PvWdl0qLnIkwLZvRTrpcCyoV4DBKcArS", // Using Sem 7 from Computer Engineering as placeholder
//       Sem8: "https://drive.google.com/drive/u/2/folders/1Q29fVOLwJoMMTxzD0yrLhK1sx-oEnBEp", // Using Sem 8 from Computer Engineering as placeholder
//     },
//     MostImportant: {
//       Sem1: "YOUR_DRIVE_LINK_HERE", // Paste your Drive link for Sem 1 and Sem 2 here
//       Sem2: "YOUR_DRIVE_LINK_HERE", // Same link as Sem 1
//       Sem3: "",
//       Sem4: "",
//       Sem5: "",
//       Sem6: "",
//       Sem7: "",
//       Sem8: "",
//     },
//   },
// };

// // Root route
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Welcome to the engi-smart-study backend API!' });
// });

// // Signup route with rate-limiting
// app.post('/api/signup', signupLimiter, async (req, res) => {
//   try {
//     const { email, password, name } = req.body;
//     if (!email || !password || !name) {
//       return res.status(400).json({ message: 'Email, password, and name are required' });
//     }

//     await validateEmailDomain(email);

//     try {
//       await auth.getUserByEmail(email);
//       return res.status(400).json({ message: 'Email already registered. Please log in.' });
//     } catch (error) {
//       if (error.code !== 'auth/user-not-found') {
//         throw error;
//       }
//     }

//     const userRecord = await auth.createUser({
//       email,
//       password,
//       displayName: name,
//     });

//     const verificationLink = await auth.generateEmailVerificationLink(email);

//     const mailOptions = {
//       from: '"Engineering Hub" <engineeringhub0001@gmail.com>',
//       to: email,
//       subject: 'Welcome to Engineering Hub - Verify Your Email',
//       text: `Hello ${name},\n\nThank you for joining Engineering Hub! Please verify your email by clicking the link below:\n${verificationLink}\n\nIf you did not sign up, please ignore this email.\n\nBest regards,\nEngineering Hub Team`,
//       html: `
        
        
          
            
//               Engineering Hub

            

            
//               Hello ${name},

//               Welcome to Engineering Hub, your platform for smart study solutions!

//               Please verify your email address to activate your account and access our resources.

              
//                 Verify Your Email
              

//               If the button doesn't work, copy and paste this link into your browser:

//               ${verificationLink}

            

            
//               If you did not sign up for Engineering Hub, please ignore this email.

//               © 2025 Engineering Hub. All rights reserved.

            

          

        
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Verification email sent to ${email}`);

//     res.status(201).json({
//       message: 'Signup successful. Please check your inbox or spam/junk folder for the verification email.',
//       userId: userRecord.uid,
//     });
//   } catch (error) {
//     console.error('Error during signup:', error.message);
//     if (error.code === 'auth/email-already-exists') {
//       return res.status(400).json({ message: 'Email already in use' });
//     } else if (error.code === 'auth/invalid-email') {
//       return res.status(400).json({ message: 'Invalid email format' });
//     } else if (error.code === 'auth/weak-password') {
//       return res.status(400).json({ message: 'Password is too weak' });
//     }
//     return res.status(400).json({ message: 'Signup failed', error: error.message });
//   }
// });

// // Resend verification email route with rate-limiting
// app.post('/api/resend-verification', resendLimiter, async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }

//     await validateEmailDomain(email);

//     let userRecord;
//     try {
//       userRecord = await auth.getUserByEmail(email);
//     } catch (error) {
//       if (error.code === 'auth/user-not-found') {
//         return res.status(404).json({ message: 'User not found. Please sign up first.' });
//       }
//       throw error;
//     }

//     if (userRecord.emailVerified) {
//       return res.status(400).json({ message: 'Email is already verified. Please log in.' });
//     }

//     const verificationLink = await auth.generateEmailVerificationLink(email);

//     const mailOptions = {
//       from: '"Engineering Hub" <engineeringhub0001@gmail.com>',
//       to: email,
//       subject: 'Resend: Verify Your Email for Engineering Hub',
//       text: `Hello ${userRecord.displayName || email.split('@')[0]},\n\nPlease verify your email by clicking the link below:\n${verificationLink}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nEngineering Hub Team`,
//       html: `
        
        
          
            
//               Engineering Hub

            

            
//               Hello ${userRecord.displayName || email.split('@')[0]},

//               We’re resending your email verification for Engineering Hub.

//               Please verify your email address to activate your account and access our resources.

              
//                 Verify Your Email
              

//               If the button doesn't work, copy and paste this link into your browser:

//               ${verificationLink}

            

            
//               If you did not request this email, please ignore it.

//               © 2025 Engineering Hub. All rights reserved.

            

          

        
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Resent verification email to ${email}`);

//     res.status(200).json({
//       message: 'Verification email resent. Please check your inbox or spam/junk folder.',
//     });
//   } catch (error) {
//     console.error('Error resending verification email:', error.message);
//     if (error.code === 'auth/invalid-email') {
//       return res.status(400).json({ message: 'Invalid email format' });
//     }
//     return res.status(400).json({ message: 'Failed to resend verification email', error: error.message });
//   }
// });

// // Login route
// app.post('/api/login', async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }

//     await validateEmailDomain(email);

//     let userRecord;
//     try {
//       userRecord = await auth.getUserByEmail(email);
//     } catch (error) {
//       if (error.code === 'auth/user-not-found') {
//         return res.status(404).json({ message: 'Please register first' });
//       }
//       throw error;
//     }

//     if (!userRecord.emailVerified) {
//       return res.status(403).json({ message: 'Please verify your email' });
//     }

//     await db.collection('loggedInUsers').doc(userRecord.uid).set({
//       email: userRecord.email,
//       name: userRecord.displayName || email.split('@')[0],
//       loginTime: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     res.status(200).json({
//       message: 'Login successful',
//       userId: userRecord.uid,
//       email: userRecord.email,
//     });
//   } catch (error) {
//     res.status(400).json({ message: 'Login failed', error: error.message });
//   }
// });

// // Verify email route
// app.get('/api/verify/:token', async (req, res) => {
//   try {
//     const { token } = req.params;
//     console.log(`Verification attempted for token: ${token}`);
//     res.status(200).json({ message: 'Verification link processed. Please log in.' });
//   } catch (error) {
//     res.status(400).json({ message: 'Verification failed', error: error.message });
//   }
// });

// // Logout route
// app.post('/api/logout', async (req, res) => {
//   try {
//     const { userId } = req.body;
//     if (!userId) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }

//     await db.collection('loggedInUsers').doc(userId).delete();

//     res.status(200).json({ message: 'Logout successful' });
//   } catch (error) {
//     res.status(400).json({ message: 'Logout failed', error: error.message });
//   }
// });

// // Get logged-in users
// app.get('/api/logged-in-users', async (req, res) => {
//   try {
//     const snapshot = await db.collection('loggedInUsers').get();
//     if (snapshot.empty) {
//       return res.status(200).json({ users: [] });
//     }
//     const users = snapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         userId: doc.id,
//         ...data,
//         loginTime: data.loginTime ? data.loginTime.toDate().toISOString() : null,
//       };
//     });
//     res.status(200).json({ users });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch logged-in users', error: error.message });
//   }
// });

// // Fetch resources
// app.get('/api/folders', (req, res) => {
//   try {
//     const { year, category, semester } = req.query;

    // if (!year || !category) {
    //   return res.status(400).json({ message: 'Year and category are required' });
    // }

    // // Normalize the year parameter with additional validation
    // let normalizedYear;
    // try {
    //   normalizedYear = decodeURIComponent(String(year)).trim();
    // } catch (e) {
    //   console.error('Decoding error for year:', e.message, 'Raw year:', year);
    //   normalizedYear = String(year).trim(); // Fallback to raw value if decoding fails
    // }
    // console.log(`Received request: year=${normalizedYear}, category=${category}, semester=${semester}`); // Enhanced debug log

    // // Check all keys in resourcesData for a case-insensitive match
    // const yearData = Object.keys(resourcesData).find(key => key.toLowerCase() === normalizedYear.toLowerCase())
    //   ? resourcesData[normalizedYear]
    //   : null;
    // if (!yearData) {
    //   console.log(`No yearData found for: ${normalizedYear}, checked keys: ${Object.keys(resourcesData).join(', ')}`); // Detailed debug log
    //   return res.status(404).json({ message: `No resources found for year/branch: ${normalizedYear}` });
    // }

    // if (category === 'Syllabus') {
    //   const syllabus = yearData.Syllabus || [];
    //   const filteredSyllabus = semester ? syllabus.filter(s => {
    //     const semMatch = s.name.match(/Sem (\d+)/);
    //     console.log(`Filtering: ${s.name}, semester=${semester}, match=${semMatch}`); // Debug log
    //     return !semMatch || semester === `Sem${semMatch[1]}`;
    //   }) : syllabus;
    //   if (filteredSyllabus.length === 0) {
    //     console.log(`No syllabus found for semester: ${semester} in ${normalizedYear}`); // Debug log
    //   }
    //   return res.status(200).json({ pdfs: filteredSyllabus });
    // }

    // if (category === 'Pyq') {
    //   if (!semester) {
    //     return res.status(400).json({ message: 'Semester is required for PYQ category' });
    //   }
    //   const pyqUrl = yearData.Pyq[String(semester)];
    //   if (!pyqUrl) {
    //     console.log(`No PYQ found for semester: ${semester} in ${normalizedYear}`); // Debug log
    //     return res.status(404).json({ message: `No PYQ found for semester: ${semester} in ${normalizedYear}` });
    //   }
    //   return res.status(200).json({ url: pyqUrl });
    // }

    // if (category === 'MostImportant') {
    //   if (!semester) {
    //     return res.status(400).json({ message: 'Semester is required for Most Important category' });
    //   }
    //   const mostImportantUrl = yearData.MostImportant[String(semester)];
    //   if (!mostImportantUrl) {
    //     console.log(`No Most Important resource found for semester: ${semester} in ${normalizedYear}`); // Debug log
    //     return res.status(404).json({ message: `No Most Important resource found for semester: ${semester} in ${normalizedYear}` });
    //   }
    //   return res.status(200).json({ url: mostImportantUrl });
    // }

    // return res.status(400).json({ message: 'Invalid category' });
//   } catch (error) {
//     console.error('Error in /api/folders:', error.message);
//     res.status(500).json({ message: 'Failed to fetch resources', error: error.message });
//   }
// });

// app.get('/api/config', (req, res) => {
//   const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
//   if (!apiKey) {
//     return res.status(500).json({ error: "API key not found" });
//   }
//   res.json({ youtubeApiKey: apiKey });
// });
// app.use('/api/gemini', geminiRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import resourcesRoutes from './routes/resources.routes.js';
import configRoutes from './routes/config.routes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,        
}));
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get('/', (req, res) => res.json({ message: 'Welcome to the engi-smart-study backend API!' }));

app.use('/api', authRoutes);
app.use('/api', resourcesRoutes);
app.use('/api', configRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/files', express.static(path.join(__dirname, 'backend/public/files')));
app.use('/files', express.static(path.join(__dirname, 'public/files')));
app.get('/scholarship/download', (req, res) => {
  const filePath = path.join(__dirname, 'backend/public/files/Scholarship.pdf');
  res.download(filePath, 'Scholarship.pdf');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
