// lib/firebase-client.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBvQ6xKgYUEdiCK0lvH1HtSszVckUpi0x6epKhZQ4Crj",
  authDomain: "nichofy-cb282.firebaseapp.com",
  projectId: "nichofy-cb282",
  storageBucket: "nichofy-cb282.appspot.com",
  messagingSenderId: "101373751669209319428",
  appId: "1:101373751669209319428:web:506715686"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Auth
export const auth = getAuth(app)

export default app
