// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKL4_Mj75rT12tYqPR5Jqu9x_-P6C22DE",
  authDomain: "engi-smart-study.firebaseapp.com",
  databaseURL: "https://engi-smart-study-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "engi-smart-study",
  storageBucket: "engi-smart-study.firebasestorage.app",
  messagingSenderId: "462370317992",
  appId: "1:462370317992:web:3409b59dccd61fa188049d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export the initialized services
export { auth, db };