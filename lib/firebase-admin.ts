// lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'

const firebaseAdminConfig = {
  credential: cert({
    projectId: "nichofy-cb282",
    clientEmail: "firebase-adminsdk-fbsvc@nichofy-cb282.iam.gserviceaccount.com",
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  storageBucket: "nichofy-cb282.appspot.com"
}

// Initialize Firebase Admin (only if not already initialized)
const adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0]

// Initialize Firebase Admin services
export const adminDb = getFirestore(adminApp)
export const adminAuth = getAuth(adminApp)
export const adminStorage = getStorage(adminApp)

export default adminApp
