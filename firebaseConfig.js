// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword as createUser, signInWithEmailAndPassword as signIn } from "firebase/auth"; // Import necessary functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBMKmyPOzRtuHn1UMgV0874VcoC0W2sTA",
  authDomain: "caboodle-55dd3.firebaseapp.com",
  projectId: "caboodle-55dd3",
  storageBucket: "caboodle-55dd3.appspot.com",
  messagingSenderId: "684419267498",
  appId: "1:684419267498:web:80845a42dcc09c957889d3",
  measurementId: "G-MST9V7S039"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Define createUserWithEmailAndPassword function
const createUserWithEmailAndPassword = (email, password) => {
  return createUser(auth, email, password);
};

// Define signInWithEmailAndPassword function
const signInWithEmailAndPassword = (email, password) => {
  return signIn(auth, email, password);
};

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword }; // Export the auth object, createUserWithEmailAndPassword and signInWithEmailAndPassword functions
