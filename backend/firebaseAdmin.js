import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.join(__dirname, './serviceAccountKey.json');

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (err) {
  console.error('Could not read serviceAccountKey.json');
  throw err;
}

// Ensure bucket is set
const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
if (!bucketName) {
  console.warn('FIREBASE_STORAGE_BUCKET is not set. Storage operations will fail.');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucketName, // must be exact
  });
}

const db = admin.firestore();
const auth = admin.auth();

// Only create bucket if bucketName exists
let bucket;
if (bucketName) {
  bucket = admin.storage().bucket(bucketName); // 🔑 explicitly pass bucket name here
}

console.log('Firebase Admin initialized with bucket:', bucketName);

export { admin, db, auth, bucket };
