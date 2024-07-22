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
  updateDoc,
} from "firebase/firestore";
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
    );
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

    const pubCatalogDocRef = doc(
      collection(firestore, "publicCatalogs"),
      docRef.id
    );
    await setDoc(
      pubCatalogDocRef,
      { publicCatalogId: docRef.id },
      { merge: true }
    );
    console.log("Catalog successfully added to public list:", docRef.id);

    const catalogDocRef = doc(
      collection(firestore, "users", userId, "catalogs"),
      catalogId
    );
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

const addToPublicItemList = async (
  UserId,
  catalogId,
  pubCatalogId,
  itemId,
  item
) => {
  try {
    const docRef = await addDoc(
      collection(firestore, "publicCatalogs", pubCatalogId, "publicItems"),
      {
        publicItemId: null,
        itemId: itemId,
        itemName: item.name,
        itemValue: item.value,
        itemDescription: item.description,
      }
    );

    const itemDocRef = doc(
      collection(firestore, "publicCatalogs", pubCatalogId, "publicItems"),
      docRef.id
    );
    await setDoc(itemDocRef, { publicItemId: docRef.id }, { merge: true });
    console.log("Item successfully added to public list:", docRef.id);

    const itemRef = doc(
      collection(firestore, "users", UserId, "catalogs", catalogId, "items"),
      itemId
    );
    await setDoc(itemRef, { publicId: docRef.id }, { merge: true });
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
      publicItems.push(doc.data());
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
    const publicAttributes = [];
    querySnapshot.forEach((doc) => {
      publicAttributes.push(doc.data());
    });
    console.log("Public Attributes fetched successfully.");
    return publicAttributes;
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
      await updateDoc(publicAttrRef, { name: newName, value: newValue });
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
      await updateDoc(publicCatRef, { name: newName });
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
      await updateDoc(publicItemRef, { name: newName});
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


export const testFunction = () => {
  console.log("Test function called");
};

const createChat = async (user1Id, user2Id, name1, name2, message) => {
  try {
    const docRef = await addDoc(collection(firestore, "chats"), {
      chatId: null,
      user1Id: user1Id,
      user2Id: user2Id,
      name1: name1,
      name2: name2,
      messageSender: name1,
      messages: message,
    });

    const chatDocRef = doc(collection(firestore, "chats"), docRef.id);
    await setDoc(chatDocRef, { chatId: docRef.id }, { merge: true });

    console.log("Chat successfully created:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating chat:", error.message);
    throw error;
  }
};

const addMessage = async (chatId, name, message) => {
  try {
    const chatRef = doc(firestore, "chats", chatId);
    await setDoc(chatRef, { messageSender: name }, { merge: true });
    await setDoc(chatRef, { messages: message }, { merge: true });
    console.log("Message successfully added to chat:", chatId);
  } catch (error) {
    console.error("Error adding message to chat:", error.message);
    throw error;
  }
};

const fetchChats = async (userId) => {
  try {
    const q = query(collection(firestore, "chats"));
    const querySnapshot = await getDocs(q);
    const chats = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().name1 === userId || doc.data().name2 === userId) {
        chats.push(doc.data());
      }
    });
    return chats;
  } catch (error) {
    console.error("Error fetching chat data:", error.message);
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
  createChat,
  addMessage,
  fetchChats,
  updateAttribute,
  updateCatalogName,
  updateItemName
};
