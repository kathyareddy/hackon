// src/lib/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1J4sTz44y1UL3bDloT1N6yj1myUtu33E",
  authDomain: "ai-app-6157c.firebaseapp.com",
  projectId: "ai-app-6157c",
  storageBucket: "ai-app-6157c.firebasestorage.app",
  messagingSenderId: "600749874084",
  appId: "1:600749874084:web:826a246a1fca683124bf31",
  measurementId: "G-MB9MENCKD7",
};

// Prevent re-initialization on hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
