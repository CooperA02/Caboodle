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
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

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

// Initialize Firebase Auth with AsyncStorage for persistence
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

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
  const userDocRef = doc(collection(getFirestore(), "users"), userId);
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
    const userDoc = await getDoc(
      doc(collection(getFirestore(), "users"), userId)
    );
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
      collection(getFirestore(), "users", userId, "catalogs"),
      {
        id: null,
        name: Catalog.name,
        category: Catalog.category,
        description: Catalog.description,
      }
    );
    const catalogDocRef = doc(
      collection(getFirestore(), "users", userId, "catalogs"),
      docRef.id
    );
    await setDoc(
      catalogDocRef,
      {
        id: docRef.id,
      },
      { merge: true }
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
    const q = query(collection(getFirestore(), "users", userId, "catalogs"));
    const querySnapshot = await getDocs(q);
    const catalogs = [];
    querySnapshot.forEach((doc) => {
      catalogs.push(doc.data());
    });
    return catalogs;
  } catch (error) {
    console.error("Error fetching catalog data:", error.message);
    throw error;
  }
};

// Define createItem function
const createItem = async (userId, catalogId, Item) => {
  try {
    const docRef = await addDoc(
      collection(
        getFirestore(),
        "users",
        userId,
        "catalogs",
        catalogId,
        "items"
      ),
      {
        id: null,
        name: Item.name,
        value: Item.value,
      }
    );
    const itemDocRef = doc(
      collection(
        getFirestore(),
        "users",
        userId,
        "catalogs",
        catalogId,
        "items"
      ),
      docRef.id
    );
    await setDoc(
      itemDocRef,
      {
        id: docRef.id,
      },
      { merge: true }
    );
    console.log("Item successfully created:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating Item:", error.message);
    throw error;
  }
};

const fetchItems = async (userId, catalogId) => {
  try {
    const q = query(
      collection(
        getFirestore(),
        "users",
        userId,
        "catalogs",
        catalogId,
        "items"
      )
    );
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });
    return items;
  } catch (error) {
    console.error("Error fetching item data:", error.message);
    throw error;
  }
};

const createAttribute = async (userId, catalogId, itemId) => {
  try {
    const docRef = await addDoc(
      collection(
        firestore,
        "users",
        userId,
        "catalogs",
        catalogId,
        "items",
        itemId,
        "attributes"
      ),
      {
        id: null,
        name: Attribute.name,
        value: Attribute.value,
      }
    );
    const itemDocRef = doc(
      collection(
        firestore,
        "users",
        userId,
        "catalogs",
        catalogId,
        "items",
        itemId,
        "attributes"
      ),
      docRef.id
    );
    await setDoc(
      itemDocRef,
      {
        id: docRef.id,
      },
      { merge: true }
    );
    console.log("Attribute successfully created:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating Attribute:", error.message);
    throw error;
  }
};

const fetchAttributes = async (userId, catalogId, itemId) => {
  try {
    const q = query(
      collection(
        firestore,
        "users",
        userId,
        "catalogs",
        catalogId,
        "items",
        itemId,
        "attributes"
      )
    );
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });
    return items;
  } catch (error) {
    console.error("Error fetching Attribute data:", error.message);
    throw error;
  }
};

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  handleSaveProfile,
  fetchUserData,
  createCatalog,
  fetchCatalogs,
  createItem,
  fetchItems,
  createAttribute,
  fetchAttributes,
};
