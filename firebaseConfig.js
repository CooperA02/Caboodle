import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword as createUser,
  signInWithEmailAndPassword as signIn,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
} from "firebase/firestore"; // Import getDoc

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBMKmyPOzRtuHn1UMgV0874VcoC0W2sTA",
  authDomain: "caboodle-55dd3.firebaseapp.com",
  projectId: "caboodle-55dd3",
  storageBucket: "caboodle-55dd3.appspot.com",
  messagingSenderId: "684419267498",
  appId: "1:684419267498:web:80845a42dcc09c957889d3",
  measurementId: "G-MST9V7S039",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app); // Initialize Firestore

// Define createUserWithEmailAndPassword function
const createUserWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUser(auth, email, password);
    console.log("User successfully created:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

// Define signInWithEmailAndPassword function
const signInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signIn(auth, email, password);
    console.log("User successfully signed in:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};

// Define handleSaveProfile function
const handleSaveProfile = async (
  userId,
  username,
  phoneNumber,
  profilePictureUrl,
  isPrivate
) => {
  const userDocRef = doc(collection(firestore, "users"), userId);
  try {
    // Update user data in Firestore
    await setDoc(
      userDocRef,
      {
        username,
        phoneNumber,
        profilePictureUrl, // Add profile picture URL to user data
        isPrivate, // Add isPrivate to user data
      },
      { merge: true }
    ); // Use merge option to merge with existing data if it exists
    console.log("User profile updated successfully!");
  } catch (error) {
    console.error("Error saving user profile:", error.message);
    throw error;
  }
};

// Define fetchUserData function
const fetchUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(collection(firestore, "users"), userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
};

// Define createCatalog function
const createCatalog = async (userId, Catalog) => {
  try {
    const docRef = await addDoc(
      collection(firestore, "users", userId, "catalogs"),
      {
        name: Catalog.name,
        category: Catalog.category,
        description: Catalog.description,
      }
    );
    console.log("Catalog successfully created:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating Catalog:", error.message);
    throw error;
  }
};

const fetchCatalogs = async (userId) => {
  try {
    const q = query(collection(firestore, "users", userId, "catalogs"));
    const querySnapshot = await getDocs(q);
    const catalogs = [];
    querySnapshot.forEach((doc) => {
      catalogs.push(doc.data());
    });
    return catalogs;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
};

export {
  auth,
  firestore,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  handleSaveProfile,
  fetchUserData,
  createCatalog,
  fetchCatalogs,
};
