// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6VStG7Fs468-3NNqGMW9bZOoiwA5jRAs",
  authDomain: "mirrortalk-1f2bc.firebaseapp.com",
  projectId: "mirrortalk-1f2bc",
  storageBucket: "mirrortalk-1f2bc.firebasestorage.app",
  messagingSenderId: "1069156713375",
  appId: "1:1069156713375:web:b298a686ea78793bf4b3aa",
  measurementId: "G-DETP5N7HDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);