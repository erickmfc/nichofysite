// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyND0kw70kzPofmq8_dK0K_gFF1qV1Jdo",
  authDomain: "nichofy-cb282.firebaseapp.com",
  projectId: "nichofy-cb282",
  storageBucket: "nichofy-cb282.firebasestorage.app",
  messagingSenderId: "621379290571",
  appId: "1:621379290571:web:ee5e75df2079378959e24e",
  measurementId: "G-DVBG19K4ZQ"
};

// Google OAuth Configuration
export const googleOAuthConfig = {
  clientId: "621379290571-m1kr5opp266vh1vlkh0i2nd1oj4sc0ii.apps.googleusercontent.com",
  projectId: "project-621379290571",
  supportEmail: "matheusfc777@gmail.com"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics only on client side
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;