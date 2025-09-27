import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let serviceAccount = null;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
  const keyPath = path.join(process.cwd(), 'serviceAccountKey.json');
  if (fs.existsSync(keyPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  } else {
    console.warn('No Firebase service account found. Ensure serviceAccountKey.json or FIREBASE_SERVICE_ACCOUNT_JSON is set.');
  }
}

if (!admin.apps.length) {
  if (!serviceAccount) {
    throw new Error('Firebase service account not found. Add serviceAccountKey.json or set FIREBASE_SERVICE_ACCOUNT_JSON.');
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
  });
}

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

export { admin, auth, db, storage };
export default admin;
