// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU_ig3QAc2LxjhAAL17o1BCprXvhIlu9M",
  authDomain: "expense-tracker-10a5d.firebaseapp.com",
  projectId: "expense-tracker-10a5d",
  storageBucket: "expense-tracker-10a5d.firebasestorage.app",
  messagingSenderId: "850503826638",
  appId: "1:850503826638:web:4011a36d4c6ee9b400e49f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {app, db, auth};