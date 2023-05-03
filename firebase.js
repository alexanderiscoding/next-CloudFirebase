import * as admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.DATABASEURL,
      storageBucket: process.env.STORAGEBUCKET,
      authDomain: process.env.AUTHDOMAIN
    });
  } catch (error) {
    console.log('Firebase admin initialization error', error.stack);
  }
}
export const firestore = admin.firestore();
export const firestoreFieldValue = admin.firestore.FieldValue;
export const database = admin.database();
export const messaging = admin.messaging();
export const storage = admin.storage();
export const bucket = admin.storage().bucket();