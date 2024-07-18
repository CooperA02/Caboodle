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
  where,
  orderBy,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  deleteDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject  } from "firebase/storage";

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
      name: item.name,
      value: item.value,
      description: item.description, 
      images: imageUrls.length > 0 ? imageUrls : [],
    };

    const docRef = await addDoc(
      collection(firestore, "users", userId, "catalogs", catalogId, "items"),
      newItem
    );

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
    const itemRef = doc(firestore, "users", userId, "catalogs", catalogId, "items", itemId);
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

    const catalogDocRef = doc(
      collection(firestore, "publicCatalogs"),
      docRef.id
    );
    await setDoc(
      catalogDocRef,
      { publicCatalogId: docRef.id },
      { merge: true }
    );

    console.log("Catalog successfully added to public list:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding catalog to public list:", error.message);
    throw error;
  }
};

const fetchPublicCatalogs = async (searchQuery = "", sortOption = "alphabetical") => {
  try {
    console.log("Fetching public catalogs...");

    let q = collection(firestore, "publicCatalogs");

    // Apply search query if provided
    if (searchQuery) {
      console.log("Applying search query:", searchQuery);
      q = query(
        q,
        where("catalogName", ">=", searchQuery),
        where("catalogName", "<=", searchQuery + '\uf8ff')
      );
    }

    // Apply sorting based on sortOption
    switch (sortOption) {
      case 'popularity':
        console.log("Sorting by popularity");
        // Assuming 'views' field exists, if not replace with a valid field
        q = query(q, orderBy('views', 'desc'));
        break;
      case 'relevance':
        console.log("Sorting by relevance");
        // Assuming 'createdAt' field exists, if not replace with a valid field
        q = query(q, orderBy('createdAt', 'desc'));
        break;
      default:
        console.log("Sorting alphabetically");
        q = query(q, orderBy('catalogName'));
    }

    const querySnapshot = await getDocs(q);
    const publicCatalogs = [];

    querySnapshot.forEach((doc) => {
      const catalogData = doc.data();
      // Ensure catalogData.images is an array of valid image URLs or an empty array
      const images = catalogData.images || []; // Use an empty array if images is undefined

      // Push the catalog with updated images array
      publicCatalogs.push({
        id: doc.id,
        catalogName: catalogData.catalogName,
        userName: catalogData.userName,
        description: catalogData.catalogDescription, // Adjusted to match firestore field
        category: catalogData.catalogCategory, // Adjusted to match firestore field
        images: catalogData.catalogImages,
      });
    });

    console.log("Total public catalogs fetched:", publicCatalogs.length);
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

const addToPublicItemList = async (catalogId, item) => {
  try {
    // Check if itemImages is defined and is an array
    const imageUrls = Array.isArray(item.itemImages) ? await Promise.all(
      item.itemImages.map(async (imageUri) => {
        const imageName = imageUri.split("/").pop();
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = ref(
          storage,
          `publicCatalogs/${catalogId}/items/${item.itemName}/${imageName}`
        );
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
      })
    ) : [];

    // Prepare item data with image URLs
    const newItem = {
      itemName: item.itemName || '', 
      itemValue: item.itemValue || '', 
      itemImages: imageUrls || [], 
    };

    // Add item to Firestore under publicItems collection within catalogId
    const docRef = await addDoc(
      collection(firestore, "publicCatalogs", catalogId, "publicItems"),
      newItem
    );

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
      if (doc.exists()) {
        publicItems.push({ id: doc.id, ...doc.data() });
      } else {
        console.log(`Document ${doc.id} does not exist`);
      }
    });
    
    console.log("Fetched public items:", publicItems);
    return publicItems;
  } catch (error) {
    console.error("Error fetching public item data:", error.message);
    throw error;
  }
};

const deletePublicItems = async (userId, catalogId, itemId) => {
  try {
    const q = query(
      collection(firestore, "publicCatalogs", catalogId, "publicItems")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().id === itemId) {
        deleteDoc(doc.ref);
      }
    });
  } catch (error) {
    console.error("Error deleting public item data:", error.message);
    throw error;
  }
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
  addToPublicCatalogList,
  fetchPublicCatalogs,
  deletePublicCatalogs,
  addToPublicItemList,
  fetchPublicItems,
  deletePublicItems,
  createChat,
  addMessage,
  fetchChats,
  fetchMessages,
  fetchLastMessage,
  searchUsers, 
  fetchGlobalChat,
  addGlobalMessage,
};