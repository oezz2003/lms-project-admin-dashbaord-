// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDb8rStBT95XhrXZDhQ0XUY1VIjAbWIwsc",
  authDomain: "lms-ibsra.firebaseapp.com",
  projectId: "lms-ibsra",
  storageBucket: "lms-ibsra.firebasestorage.app",
  messagingSenderId: "107923205570",
  appId: "1:107923205570:web:bae13e5e3dff70b1037a5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { app, auth, db };