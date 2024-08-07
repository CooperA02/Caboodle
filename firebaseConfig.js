import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword as createUser,
  signInWithEmailAndPassword as signIn,
  initializeAuth,
  browserLocalPersistence,
  getReactNativePersistence,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  where,
  orderBy,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

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

// Initialize Firebase Auth with browserLocalPersistence
let auth;

if (Platform.OS === 'web') {
  // Web environment
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  // React Native environment
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

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
    );
    console.log("User profile updated successfully!");
  } catch (error) {
    console.error("Error saving user profile:", error.message);
    throw error;
  }
};

// Function to upload profile picture and update user document
const uploadProfilePicture = async (imageUri, userId) => {
  if (!imageUri || !userId) {
    throw new Error('Image URI and User ID are required.');
  }

  const filename = `profile_pictures/${userId}/${new Date().toISOString()}.jpg`;

  try {
    const storage = getStorage();
    const storageRef = ref(storage, filename);

    const response = await fetch(imageUri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);

    const userDocRef = doc(firestore, 'users', userId);
    await updateDoc(userDocRef, { profilePictureUrl: downloadURL });

    return { url: downloadURL };
  } catch (error) {
    console.error('Error uploading profile picture:', error.message);
    throw new Error('Failed to upload profile picture.');
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
    const docRef = await addDoc(
      collection(firestore, "users", userId, "catalogs"),
      {
        id: null,
        name: catalog.name,
        category: catalog.category,
        description: catalog.description,
        images: catalog.images,
        isPublic: catalog.isPublic,
        publicId: null,
      }
    );

    // Update the newly created document with its own ID
    const catalogDocRef = doc(
      collection(firestore, "users", userId, "catalogs"),
      docRef.id
    );
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

const updateCatalogImage = async (userId, catalogId, publicCatalogId, imageUri) => {
  if (!imageUri || !userId || !catalogId) {
    throw new Error('Image URI, User ID, and Catalog ID are required.');
  }

  let currentDate = new Date().toISOString();
  console.log("Current Date:", currentDate);

  const filename = `users/${userId}/${catalogId}/${new Date().toISOString()}.jpg`;
  const pubfilename = `publicCatalogs/${publicCatalogId}/${new Date().toISOString()}.jpg`;

  try {
    const storage = getStorage();
    const storageRef = ref(storage, filename);
    const pubstorageRef = ref(storage, pubfilename);

    // Convert local file path to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload the blob to Firebase Storage
    await uploadBytes(storageRef, blob);
    await uploadBytes(pubstorageRef, blob);

    // Retrieve the download URL
    const downloadURL = await getDownloadURL(storageRef);
    const pubdownloadURL = await getDownloadURL(pubstorageRef);
    console.log("Download URL from Firebase Storage:", downloadURL);

    // Update private catalog image
    const privateCatRef = doc(firestore, "users", userId, "catalogs", catalogId);
    await updateDoc(privateCatRef, { images: [downloadURL] });

    console.log("Private Catalog image successfully updated:", catalogId);

    // Optionally update public catalog image if publicCatalogId is provided
    if (publicCatalogId) {
      const publicCatRef = doc(firestore, "publicCatalogs", publicCatalogId);
      await updateDoc(publicCatRef, { catalogImages: [pubdownloadURL] });
      console.log("Public Catalog image successfully updated:", publicCatalogId);
    } else {
      console.log("No public catalog ID provided, skipping public catalog update.");
    }

    return { url: downloadURL };
  } catch (error) {
    console.error('Error updating catalog image:', error.message);
    throw new Error('Failed to update catalog image.');
  }
};




const updateItemImage = async (userId, catalogId, publicCatalogId, itemId, publicItemId, itemUri) => {
  if (!itemUri || !userId || !catalogId || !itemId) {
    throw new Error('All parameters are required.');
  }

  console.log(`Generating filename with userId: ${userId}, catalogId: ${catalogId}, itemId: ${itemId}`);
  console.log(`Generating publicFilename with publicCatalogId: ${publicCatalogId}, publicItemId: ${publicItemId}`);


  const filename = `users/${userId}/${catalogId}/${itemId}/${new Date().toISOString()}.jpg`;
  const pubFilename = `publicCatalogs/${publicCatalogId}/${publicItemId}/${new Date().toISOString()}.jpg`;

  try {
    const storage = getStorage();
    const storageRef = ref(storage, filename);
    const pubStorageRef = ref(storage, pubFilename);

    const response = await fetch(itemUri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);
    await uploadBytes(pubStorageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    const pubDownloadURL = await getDownloadURL(pubStorageRef);

    const itemRef = doc(firestore, "users", userId, "catalogs", catalogId, "items", itemId);
    await updateDoc(itemRef, { images: [downloadURL] });

    if (publicItemId) {
      const publicItemRef = doc(firestore, "publicCatalogs", publicCatalogId, "publicItems", publicItemId);
      await updateDoc(publicItemRef, { itemImages: [pubDownloadURL] });
    } else {
      console.log("No public Item ID provided, skipping public Item update.");
    }

    return { url: downloadURL };
  } catch (error) {
    console.error('Error updating item image:', error.message);
    throw new Error('Failed to update item image.');
  }
};


// Create Item
const createItem = async (userId, catalogId, item, images) => {
  try {
    const imageUrls = await Promise.all(
      images.map(async (imageUri) => {
        const imageName = imageUri.split("/").pop();
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = ref(
          storage,
          `users/${userId}/catalogs/${catalogId}/items/${item.name}/${imageName}`
        );
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      })
    );

    const newItem = {
      id: null,
      name: item.name,
      value: item.value,
      description: item.description,
      images: imageUrls.length > 0 ? imageUrls : [],
      publicId: null,
    };

    const docRef = await addDoc(
      collection(firestore, "users", userId, "catalogs", catalogId, "items"),
      newItem
    );

    const itemDocRef = doc(
      firestore,
      "users",
      userId,
      "catalogs",
      catalogId,
      "items",
      docRef.id
    );
    await setDoc(itemDocRef, { id: docRef.id }, { merge: true });

    console.log("Item successfully created:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating item:", error.message);
    throw error;
  }
};

const fetchItems = async (userId, catalogId) => {
  try {
    const q = query(
      collection(firestore, "users", userId, "catalogs", catalogId, "items")
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return items;
  } catch (error) {
    console.error("Error fetching item data:", error.message);
    throw error;
  }
};

// Fetch a single item with its attributes and images
const fetchItem = async (userId, catalogId, itemId) => {
  try {
    const itemRef = doc(
      firestore,
      "users",
      userId,
      "catalogs",
      catalogId,
      "items",
      itemId
    );
    const itemDoc = await getDoc(itemRef);

    if (!itemDoc.exists()) {
      console.log("Item does not exist.");
      return null;
    }

    const itemData = itemDoc.data();
    const attributes = await fetchItemAttributes(userId, catalogId, itemId); // Fetch attributes

    return {
      ...itemData,
      attributes: attributes,
    };
  } catch (error) {
    console.error("Error fetching item details:", error.message);
    throw error;
  }
};

// Create Attribute
const createAttribute = async (userId, catalogId, itemId, attribute) => {
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
        publicId: null,
        name: attribute.name,
        value: attribute.value,
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

    // Check if query snapshot is empty
    if (querySnapshot.empty) {
      console.log("No attributes found for the item.");
      return [];
    }

    const attributes = [];
    querySnapshot.forEach((doc) => {
      const attributeData = doc.data();
      console.log("Attribute Data:", attributeData);
      attributes.push({ ...attributeData, id: doc.id });
    });
    return attributes;
  } catch (error) {
    console.error("Error fetching Attribute data:", error.message);
    throw error;
  }
};

const fetchItemAttributes = async (userId, catalogId, itemId) => {
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

    if (querySnapshot.empty) {
      console.log("No attributes found for the item.");
      return [];
    }

    const attributes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return attributes;
  } catch (error) {
    console.error("Error fetching attribute data:", error.message);
    throw error;
  }
};

// Delete Items
const deleteItems = async (userId, catalogId, itemId) => {
  try {
    const itemRef = doc(
      firestore,
      "users",
      userId,
      "catalogs",
      catalogId,
      "items",
      itemId
    );
    const itemDoc = await getDoc(itemRef);

    if (itemDoc.exists()) {
      const itemData = itemDoc.data();
      const imageUrls = itemData.images;

      // Delete images from storage
      const deletePromises = imageUrls.map((url) => {
        const imageRef = ref(storage, url);
        return deleteObject(imageRef);
      });

      await Promise.all(deletePromises);

      // Delete item document
      await deleteDoc(itemRef);
      console.log("Item and its images successfully deleted:", itemId);
    } else {
      console.log("No such item exists!");
    }
  } catch (error) {
    console.error("Error deleting item data:", error.message);
    throw error;
  }
};

const deleteAttributes = async (userId, catalogId, itemId, attributeId) => {
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
    querySnapshot.forEach((doc) => {
      if (doc.data().id === attributeId) {
        deleteDoc(doc.ref);
      }
    });
  } catch (error) {
    console.error("Error deleting attribute data:", error.message);
    throw error;
  }
};

const addToPublicCatalogList = async (userId, name, catalog, catalogId) => {
  try {
    const docRef = await addDoc(collection(firestore, "publicCatalogs"), {
      publicCatalogId: null,
      userId: userId,
      userName: name,
      catalogId: catalogId,
      catalogName: catalog.name,
      catalogCategory: catalog.category,
      catalogDescription: catalog.description,
      catalogImages: catalog.images, 
    });

    const pubCatalogDocRef = doc(collection(firestore, "publicCatalogs"), docRef.id);
    await setDoc(pubCatalogDocRef, { publicCatalogId: docRef.id }, { merge: true });
    console.log("Catalog successfully added to public list:", docRef.id);

    const catalogDocRef = doc(collection(firestore, "users", userId, "catalogs"), catalogId);
    await setDoc(catalogDocRef, { publicId: docRef.id }, { merge: true });

    return docRef.id;
  } catch (error) {
    console.error("Error adding catalog to public list:", error.message);
    throw error;
  }
};

const fetchPublicCatalogs = async () => {
  try {
    const q = query(collection(firestore, "publicCatalogs"));
    const querySnapshot = await getDocs(q);
    const publicCatalogs = [];
    querySnapshot.forEach((doc) => {
      publicCatalogs.push(doc.data());
    });
    return publicCatalogs;
  } catch (error) {
    console.error("Error fetching public catalog data:", error.message);
    throw error;
  }
};

const deletePublicCatalogs = async (userId, catalogId) => {
  try {
    const q = query(collection(firestore, "publicCatalogs"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().userId === userId && doc.data().catalogId === catalogId) {
        deleteDoc(doc.ref);
      }
    });
  } catch (error) {
    console.error("Error deleting public catalog data:", error.message);
    throw error;
  }
};

const addToPublicItemList = async (userId, catalogId, pubCatalogId, itemId, item) => {
  try {
    const itemDoc = await getDoc(doc(firestore, "users", userId, "catalogs", catalogId, "items", itemId));
    const itemData = itemDoc.data();
    const imageUrls = itemData.images || [];

    const docRef = await addDoc(
      collection(firestore, "publicCatalogs", pubCatalogId, "publicItems"),
      {
        publicItemId: null,
        itemId: itemId,
        itemName: item.name,
        itemValue: item.value,
        itemDescription: item.description,
        images: imageUrls,
        attributes: [ 
          { attributeName: "Value", attributeValue: item.value },
          { attributeName: "Description", attributeValue: item.description }
        ]
      }
    );

    const itemDocRef = doc(firestore, "publicCatalogs", pubCatalogId, "publicItems", docRef.id);
    await setDoc(itemDocRef, { publicItemId: docRef.id }, { merge: true });

    const userItemRef = doc(firestore, "users", userId, "catalogs", catalogId, "items", itemId);
    await setDoc(userItemRef, { publicId: docRef.id }, { merge: true });

    console.log("Item successfully added to public list:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding item to public list:", error.message);
    throw error;
  }
};

const fetchPublicItems = async (catalogId) => {
  try {
    const q = query(
      collection(firestore, "publicCatalogs", catalogId, "publicItems")
    );
    const querySnapshot = await getDocs(q);
    const publicItems = [];
    querySnapshot.forEach((doc) => {
      const itemData = doc.data();
      publicItems.push({ ...itemData, id: doc.id }); 
    });
    console.log("Public Items fetched successfully.");
    return publicItems;
  } catch (error) {
    console.error("Error fetching public item data:", error.message);
    throw error;
  }
};

const deletePublicItems = async (pubCatalogId, itemId) => {
  try {
    const q = query(
      collection(firestore, "publicCatalogs", pubCatalogId, "publicItems")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().publicItemId === itemId) {
        deleteDoc(doc.ref);
      }
      console.log("Item successfully deleted:", itemId);
    });
  } catch (error) {
    console.error("Error deleting public item data:", error.message);
    throw error;
  }
};

const addToPublicAttributeList = async (
  UserId,
  catalogId,
  pubCatalogId,
  itemId,
  pubItemId,
  attributeId,
  attribute
) => {
  try {
    const docRef = await addDoc(
      collection(
        firestore,
        "publicCatalogs",
        pubCatalogId,
        "publicItems",
        pubItemId,
        "publicAttributes"
      ),
      {
        publicAttributeId: null,
        attributeId: attributeId,
        attributeName: attribute.name,
        attributeValue: attribute.value,
      }
    );

    const attributeDocRef = doc(
      collection(
        firestore,
        "publicCatalogs",
        pubCatalogId,
        "publicItems",
        pubItemId,
        "publicAttributes"
      ),
      docRef.id
    );
    await setDoc(
      attributeDocRef,
      { publicAttributeId: docRef.id },
      { merge: true }
    );
    console.log("Attribute successfully added to public list:", docRef.id);

    const attributeRef = doc(
      collection(
        firestore,
        "users",
        UserId,
        "catalogs",
        catalogId,
        "items",
        itemId,
        "attributes"
      ),
      attributeId
    );
    await setDoc(attributeRef, { publicId: docRef.id }, { merge: true });

    return docRef.id;
  } catch (error) {
    console.error("Error adding item to public list:", error.message);
    throw error;
  }
};

const fetchPublicAttributes = async (pubCatalogId, pubItemId) => {
  try {
    const itemDocRef = doc(firestore, "publicCatalogs", pubCatalogId, "publicItems", pubItemId);
    const itemDoc = await getDoc(itemDocRef);

    if (!itemDoc.exists()) {
      console.log("No public attributes found for the item.");
      return [];
    }

    const itemData = itemDoc.data();
    const defaultAttributes = [
      { attributeName: 'Value', attributeValue: itemData.itemValue },
      { attributeName: 'Description', attributeValue: itemData.itemDescription },
    ];

    const q = query(collection(firestore, "publicCatalogs", pubCatalogId, "publicItems", pubItemId, "publicAttributes"));
    const querySnapshot = await getDocs(q);

    const additionalAttributes = [];
    querySnapshot.forEach((doc) => {
      additionalAttributes.push({ id: doc.id, ...doc.data() });
    });

    console.log("Public Attributes fetched successfully.");
    return [...defaultAttributes, ...additionalAttributes];
  } catch (error) {
    console.error("Error fetching public attribute data:", error.message);
    throw error;
  }
};

const deletePublicAttributes = async (pubCatalogId, pubItemId, attributeId) => {
  try {
    const q = query(
      collection(
        firestore,
        "publicCatalogs",
        pubCatalogId,
        "publicItems",
        pubItemId,
        "publicAttributes"
      )
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().publicAttributeId === attributeId) {
        deleteDoc(doc.ref);
      }
      console.log("Attribute successfully deleted:", attributeId);
    });
  } catch (error) {
    console.error("Error deleting public attribute data:", error.message);
    throw error;
  }
};


const updateAttribute = async (userId, catalogId, publicCatalogId, itemId, publicItemId, attributeId, publicAttributeId, newName, newValue) => {
  try {
    const privateAttrRef = doc(firestore, "users", userId, "catalogs", catalogId, "items", itemId, "attributes", attributeId);
    await updateDoc(privateAttrRef, { name: newName, value: newValue });

    if (publicCatalogId && publicItemId) {
      const publicAttrRef = doc(firestore, "publicCatalogs", publicCatalogId, "publicItems", publicItemId, "publicAttributes", publicAttributeId);
      await updateDoc(publicAttrRef, { attributeName: newName, attributeValue: newValue });
    } else {
      console.log("No public catalog/item ID provided, skipping public attribute update.");
    }

    console.log("Attribute successfully updated:", attributeId);
  } catch (error) {
    console.error("Error updating attribute:", error.message);
    throw error;
  }
};

const updateCatalogName = async (userId, catalogId, publicCatalogId, newName) => {
  try {
    const privateCatRef = doc(firestore, "users", userId, "catalogs", catalogId);
    await updateDoc(privateCatRef, { name: newName });

    if (publicCatalogId) {
      const publicCatRef = doc(firestore, "publicCatalogs", publicCatalogId);
      await updateDoc(publicCatRef, { catalogName: newName });
      console.log("Public Catalog successfully updated:", publicCatalogId);
    } else {
      console.log("No public catalog ID provided, skipping public catalog update.");
    }

    console.log("Catalog successfully updated:", catalogId);
  } catch (error) {
    console.error("Error updating Catalog:", error.message);
    throw error;
  }
};


const updateItemName = async (userId, catalogId, publicCatalogId, itemId, publicItemId, newName) => {
  try {
    const privateItemRef = doc(firestore, "users", userId, "catalogs", catalogId, "items", itemId);
    await updateDoc(privateItemRef, { name: newName});

    if (publicCatalogId && publicItemId) {
      const publicItemRef = doc(firestore, "publicCatalogs", publicCatalogId, "publicItems", publicItemId);
      await updateDoc(publicItemRef, { itemName: newName});
      console.log("Public Item successfully updated:", itemId);
    } else {
      console.log("No public item ID provided, skipping public Item update.");
    }

    console.log("Attribute successfully updated:", itemId);
  } catch (error) {
    console.error("Error updating Item:", error.message);
    throw error;
  }
};


const validateItemDescription = (value) => {
  if (typeof value !== 'string') {
    console.error("validateItemDescription: value is not a string:", value);
    return false;
  }
  // Allow all characters
  const descriptionRegex = /^.*$/;
  return descriptionRegex.test(value);
};

const updateItemDescription = async (userId, catalogId, publicCatalogId, itemId, publicItemId, newDescription) => {
  console.log("updateItemDescription called with:", userId, catalogId, publicCatalogId, itemId, publicItemId, newDescription);

  try {
    // Ensure new value is a string to mitigate errors
    const newDescriptionString = String(newDescription).trim();
    console.log("Trimmed description string:", newDescriptionString);

    if (typeof newDescriptionString !== 'string') {
      console.error("newDescription is not a string:", newDescription);
      throw new Error("Invalid newDescription: not a string");
    }

    if (!validateItemDescription(newDescriptionString)) {
      throw new Error("Invalid item description format");
    }

    const itemRef = doc(firestore, "users", userId, "catalogs", catalogId, "items", itemId);
    const itemDoc = await getDoc(itemRef);

    if (itemDoc.exists()) {
      const itemData = itemDoc.data();
      console.log("Current item data before update:", itemData);

      console.log("Updating private item description with:", newDescriptionString);
      await updateDoc(itemRef, { description: newDescriptionString });

      if (publicCatalogId && publicItemId) {
        const publicItemRef = doc(firestore, "publicCatalogs", publicCatalogId, "publicItems", publicItemId);
        console.log("Updating public item description with:", newDescriptionString);
        await updateDoc(publicItemRef, { itemDescription: newDescriptionString });
      }

      const updatedItemDoc = await getDoc(itemRef);
      console.log("Updated item data after update:", updatedItemDoc.data());

      console.log("Item description successfully updated:", itemId);
    } else {
      throw new Error("Item document not found");
    }
  } catch (error) {
    console.error("Error updating item description:", error.message);
    throw error;
  }
};




const validateItemValue = (value) => {
  const valueRegex = /^[A-Za-z0-9$]*$/;
  return valueRegex.test(value);
};

const updateItemValue = async (userId, catalogId, publicCatalogId, itemId, publicItemId, attributeId, newValue) => {
  console.log("updateItemValue called with:", userId, catalogId, publicCatalogId, itemId, publicItemId, attributeId, newValue);

  try {
    // ensure new value is a string to mitigate errors
    const newValueString = String(newValue).trim();

    if (typeof newValueString !== 'string') {
      console.error("newValue is not a string:", newValue);
      throw new Error("Invalid newValue: not a string");
    }

    if (!validateItemValue(newValueString)) {
      throw new Error("Invalid item value format");
    }

    const itemRef = doc(firestore, "users", userId, "catalogs", catalogId, "items", itemId);
    const itemDoc = await getDoc(itemRef);

    if (itemDoc.exists()) {
      await updateDoc(itemRef, { value: newValueString });

          if (publicCatalogId && publicItemId) {
              const publicItemRef = doc(firestore, "publicCatalogs", publicCatalogId, "publicItems", publicItemId);
              await updateDoc(publicItemRef, { itemValue: newValue });
          }

          console.log("Item value successfully updated:", itemId);
      } else {
          throw new Error("Item document not found");
      }
  } catch (error) {
      console.error("Error updating item value:", error.message);
      throw error;
  }
};




export const testFunction = () => {
  console.log("Test function called");
};

// Function to create a new chat between two users
const createChat = async (user1Id, user2Id) => {
  try {
    const user1DocRef = doc(firestore, 'users', user1Id);
    const user1Doc = await getDoc(user1DocRef);
    const name1 = user1Doc.exists() ? user1Doc.data().username : 'Unknown';

    const user2DocRef = doc(firestore, 'users', user2Id);
    const user2Doc = await getDoc(user2DocRef);
    const name2 = user2Doc.exists() ? user2Doc.data().username : 'Unknown';

    const chatDocRef = await addDoc(collection(firestore, "chats"), {
      chatId: null,
      user1Id: user1Id,
      user2Id: user2Id,
      name1: name1,
      name2: name2,
    });

    await setDoc(chatDocRef, { chatId: chatDocRef.id }, { merge: true });

    console.log("Chat successfully created:", chatDocRef.id);
    return chatDocRef.id;
  } catch (error) {
    console.error("Error creating chat:", error.message);
    throw error;
  }
};


// Function to add a message to an existing chat
const addMessage = async (chatId, message) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const username = userDoc.exists() ? userDoc.data().username : 'Unknown';
      const profilePictureUrl = userDoc.exists() ? userDoc.data().profilePictureUrl : 'https://via.placeholder.com/40';

      const chatRef = doc(firestore, "chats", chatId);
      const messageRef = collection(chatRef, "messages");
      await addDoc(messageRef, {
        sender: username,
        text: message,
        timestamp: serverTimestamp(),
        profilePictureUrl: profilePictureUrl,
        userId: user.uid,
      });
      console.log("Message successfully added to chat:", chatId);
    }
  } catch (error) {
    console.error("Error adding message to chat:", error.message);
    throw error;
  }
};

// Function to fetch all chats for a specific user
const fetchChats = async (userId) => {
  try {
    const q1 = query(
      collection(firestore, "chats"),
      where("user1Id", "==", userId)
    );
    const q2 = query(
      collection(firestore, "chats"),
      where("user2Id", "==", userId)
    );

    const querySnapshot1 = await getDocs(q1);
    const querySnapshot2 = await getDocs(q2);

    const chats = [];
    querySnapshot1.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    querySnapshot2.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });

    return chats;
  } catch (error) {
    console.error("Error fetching chat data:", error.message);
    throw error;
  }
};

// Function to fetch all messages for a specific chat
const fetchMessages = async (chatId) => {
  try {
    const chatRef = doc(firestore, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    const messages = [];

    await Promise.all(querySnapshot.docs.map(async (messageDoc) => {
      const data = messageDoc.data();
      if (!data.userId) {
        console.error("Message data missing userId for message ID:", messageDoc.id);
        throw new Error("Message data missing userId");
      }
      const userDocRef = doc(firestore, 'users', data.userId);
      const userDoc = await getDoc(userDocRef);
      const username = userDoc.exists() ? userDoc.data().username : 'Unknown';
      const profilePictureUrl = userDoc.exists() ? userDoc.data().profilePictureUrl : 'https://via.placeholder.com/40';

      messages.push({
        id: messageDoc.id,
        ...data,
        sender: username,
        profilePictureUrl: profilePictureUrl,
      });
    }));

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    throw error;
  }
};

// Function to fetch the last message for a specific chat
const fetchLastMessage = async (chatId) => {
  try {
    const chatRef = doc(firestore, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1)); 
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const lastMessageDoc = querySnapshot.docs[0];
      const data = lastMessageDoc.data();
      const timestamp = data.timestamp.toDate(); 

      return {
        text: data.text,
        timestamp,
      };
    } else {
      return {
        text: "No messages yet",
        timestamp: null,
      };
    }
  } catch (error) {
    console.error("Error fetching last message:", error.message);
    throw error;
  }
};

// Function to search users by username
const searchUsers = async (searchQuery) => {
  try {
    const q = query(
      collection(firestore, "users"),
      where("username", ">=", searchQuery),
      where("username", "<=", searchQuery + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error searching users:", error.message);
    throw error;
  }
};

// Function to fetch all messages in the global chat
const fetchGlobalChat = async () => {
  try {
    const q = query(collection(firestore, "globalChat"), orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    const messages = [];

    await Promise.all(querySnapshot.docs.map(async (messageDoc) => {
      const data = messageDoc.data();
      const userDocRef = doc(firestore, 'users', data.userId);
      const userDoc = await getDoc(userDocRef);
      const username = userDoc.exists() ? userDoc.data().username : 'Unknown';
      const profilePictureUrl = userDoc.exists() ? userDoc.data().profilePictureUrl : 'https://via.placeholder.com/40';

      messages.push({
        id: messageDoc.id,
        ...data,
        messageSender: username,
        profilePictureUrl: profilePictureUrl, 
      });
    }));

    return messages;
  } catch (error) {
    console.error("Error fetching global chat data:", error.message);
    throw error;
  }
};

// Function to add a message to the global chat
const addGlobalMessage = async (sender, message, photoURL) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const username = userDoc.exists() ? userDoc.data().username : 'Unknown';

      await addDoc(collection(firestore, "globalChat"), {
        userId: user.uid,
        messageSender: username,
        messages: message,
        timestamp: serverTimestamp(),
        photoURL: photoURL || "https://example.com/default-avatar.png",
      });
    }
  } catch (error) {
    console.error("Error adding message to global chat:", error.message);
    throw error;
  }
};

export {
  auth,
  storage,
  firestore,
  doc,
  getDoc,
  updateDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  handleSaveProfile,
  uploadProfilePicture,
  fetchUserData,
  createCatalog,
  fetchCatalogs,
  deleteCatalogs,
  createItem,
  fetchItems,
  deleteItems,
  createAttribute,
  fetchAttributes,
  fetchItem,
  fetchItemAttributes,
  deleteAttributes,
  addToPublicCatalogList,
  fetchPublicCatalogs,
  deletePublicCatalogs,
  addToPublicItemList,
  fetchPublicItems,
  deletePublicItems,
  addToPublicAttributeList,
  fetchPublicAttributes,
  deletePublicAttributes,
  updateAttribute,
  updateCatalogName,
  updateItemName,
  createChat,
  addMessage,
  fetchChats,
  fetchMessages,
  fetchLastMessage,
  searchUsers, 
  fetchGlobalChat,
  addGlobalMessage,
  updateCatalogImage,
  updateItemImage,
  updateItemDescription,
  updateItemValue,
};