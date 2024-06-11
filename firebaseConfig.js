import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword as createUser,
  signInWithEmailAndPassword as signIn,
  initializeAuth,
  getReactNativePersistence,
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
  deleteDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firestore
const firestore = getFirestore(app);

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
        profilePictureUrl,
        isPrivate,
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
const createCatalog = async (userId, catalog) => {
  try {
    // Create a new catalog document with the provided catalog data including images
    const docRef = await addDoc(collection(firestore, "users", userId, "catalogs"), {
      id: null,
      name: catalog.name,
      category: catalog.category,
      description: catalog.description,
      images: catalog.images, // Include the images field
    });

    // Update the newly created document with its own ID
    const catalogDocRef = doc(collection(firestore, "users", userId, "catalogs"), docRef.id);
    await setDoc(catalogDocRef, { id: docRef.id }, { merge: true });

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
    console.error("Error fetching catalog data:", error.message);
    throw error;
  }
};

const deleteCatalogs = async (userId, catalogId) => {
  try {
    const q = query(collection(firestore, "users", userId, "catalogs"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().id === catalogId) {
        deleteDoc(doc.ref);
      }
    });
  } catch (error) {
    console.error("Error deleting catalog data:", error.message);
    throw error;
  }
};

// Create Item
const createItem = async (userId, catalogId, item, images) => {
  try {
    const imageUrls = await Promise.all(
      images.map(async (imageUri) => {
        const imageName = imageUri.split('/').pop(); // Get the image name from the URI
        const response = await fetch(imageUri); // Fetch the image data
        const blob = await response.blob(); // Convert the fetched data into a Blob
        const storageRef = ref(storage, `users/${userId}/catalogs/${catalogId}/items/${item.name}/${imageName}`);
        await uploadBytes(storageRef, blob); // Upload the image to Firebase Storage
        const downloadURL = await getDownloadURL(storageRef); // Get the download URL of the uploaded image
        return downloadURL;
      })
    );

    const newItem = {
      name: item.name,
      value: item.value,
      images: imageUrls.length > 0 ? imageUrls : [], // Ensure images field is always an array
    };

    const docRef = await addDoc(
      collection(firestore, "users", userId, "catalogs", catalogId, "items"),
      newItem
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
      collection(firestore, "users", userId, "catalogs", catalogId, "items")
    );
    const querySnapshot = await getDocs(q);
    const items = [];

    for (const doc of querySnapshot.docs) {
      const itemData = doc.data();
      const images = [];

      // Fetch images for the current item
      for (const imageUrl of itemData.images) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const downloadURL = await uploadBlobToStorage(userId, catalogId, doc.id, blob); // Upload blob and get download URL
        images.push(downloadURL);
      }

      // Update item data with fetched image URLs
      itemData.images = images;
      
      // Add item to the array
      items.push({ id: doc.id, ...itemData });
    }

    console.log("Fetched items:", items); // Log fetched items
    return items;
  } catch (error) {
    console.error("Error fetching item data:", error.message);
    throw error;
  }
};


const uploadBlobToStorage = async (userId, catalogId, itemId, blob) => {
  try {
    const imageName = `${itemId}_${Date.now()}.jpg`; // Generate a unique image name
    const storageRef = ref(storage, `users/${userId}/catalogs/${catalogId}/items/${itemId}/${imageName}`);
    await uploadBytes(storageRef, blob); // Upload the image to Firebase Storage
    const downloadURL = await getDownloadURL(storageRef); // Get the download URL of the uploaded image
    return downloadURL;
  } catch (error) {
    console.error("Error uploading blob to storage:", error.message);
    throw error;
  }
};

// Create Attribute
const createAttribute = async (userId, catalogId, itemId, attribute) => {
  try {
    const docRef = await addDoc(
      collection(firestore, "users", userId, "catalogs", catalogId, "items", itemId, "attributes"),
      {
        id: null, // Make sure id is set properly
        name: attribute.name,
        value: attribute.value,
      }
    );
    const itemDocRef = doc(
      collection(firestore, "users", userId, "catalogs", catalogId, "items", itemId, "attributes"),
      docRef.id
    );
    await setDoc(itemDocRef, { id: docRef.id }, { merge: true });
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
      collection(firestore, "users", userId, "catalogs", catalogId, "items", itemId, "attributes")
    );
    const querySnapshot = await getDocs(q);

    // Check if query snapshot is empty
    if (querySnapshot.empty) {
      console.log("No attributes found for the item.");
      return [];
    }

    const attributes = [];
    querySnapshot.forEach((doc) => {
      const attributeData = doc.data();
      console.log("Attribute Data:", attributeData); // Log the attribute data to see if it's fetched correctly
      attributes.push({ ...attributeData, id: doc.id }); // Make sure id is included
    });
    return attributes;
  } catch (error) {
    console.error("Error fetching Attribute data:", error.message);
    throw error;
  }
};


// Delete Items (No modifications needed)
const deleteItems = async (userId, catalogId, itemId) => {
  try {
    const q = query(
      collection(firestore, "users", userId, "catalogs", catalogId, "items")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().id === itemId) {
        deleteDoc(doc.ref);
      }
    });
  } catch (error) {
    console.error("Error deleting item data:", error.message);
    throw error;
  }
};


export {
  auth,
  storage,
  firestore,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  handleSaveProfile,
  fetchUserData,
  createCatalog,
  fetchCatalogs,
  deleteCatalogs,
  createItem,
  fetchItems,
  deleteItems,
  createAttribute,
  fetchAttributes,
};
