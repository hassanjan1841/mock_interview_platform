// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCWAv9MV91gyc170brA1uUZzB8-tdy6jrU",
  authDomain: "prepwise-f2ccd.firebaseapp.com",
  projectId: "prepwise-f2ccd",
  storageBucket: "prepwise-f2ccd.firebasestorage.app",
  messagingSenderId: "491759172584",
  appId: "1:491759172584:web:0d233cc7f21bf4885fc25d",
  measurementId: "G-DWNTHJBDYP",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
