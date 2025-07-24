// firebase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANF7Yij-Nt4eTEPqEqh_f8xlY7oQB4O3Q",
  authDomain: "calling-app-7cab9.firebaseapp.com",
  projectId: "calling-app-7cab9",
  storageBucket: "calling-app-7cab9.appspot.com",
  messagingSenderId: "826218923004",
  appId: "1:826218923004:web:ce46abd3cf4fc7a7a7e879",
  measurementId: "G-SRTYJRXLCL"
};

// Initialize Firebase App
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth with proper React Native persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If auth is already initialized, use getAuth
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

const db = getFirestore(app);

export { auth, db };

