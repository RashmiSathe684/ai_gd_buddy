import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyBPVq9_9y1uexDPZ9K7vTjshooRSj66F7E",
  authDomain: "ai-gd-buddy.firebaseapp.com",
  projectId: "ai-gd-buddy",
  storageBucket: "ai-gd-buddy.firebasestorage.app",
  messagingSenderId: "753484024062",
  appId: "1:753484024062:web:2b05a44d624d942f053daf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);