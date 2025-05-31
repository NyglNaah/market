import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_tc__md7c7BG9Vr7t9B3z-vXBcUpKpq8",
  authDomain: "market-pi4ivt.firebaseapp.com",
  projectId: "market-pi4ivt",
  storageBucket: "market-pi4ivt.firebasestorage.app",
  messagingSenderId: "1061162642815",
  appId: "1:1061162642815:web:a901e3cdd542f3b7363e4a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);