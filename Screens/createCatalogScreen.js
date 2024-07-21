import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "../Components/header";
import {
  Searchbar,
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  Paragraph,
  Text as RNPText,
  Appbar,
} from 'react-native-paper';
import {
  auth,
  createCatalog,
  storage,
  addToPublicCatalogList,
  fetchUserData,
} from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CreateCatalogScreen({ navigation }) {
  const [catalogName, setCatalogName] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("");
  const [catalogDescription, setCatalogDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isPublic, setIsPrivate] = useState(false);

  const uploadImageAsync = async (uri) => {
    try {
      const blob = await fetch(uri).then((response) => response.blob());
      const storageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/images/${Date.now()}`
      );
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  const handleCreateCatalog = async () => {
    try {
      const imageUrls = await Promise.all(
        selectedImages.map((uri) => uploadImageAsync(uri))
      );

      const newCatalog = {
        name: catalogName,
        category: catalogCategory,
        description: catalogDescription,
        images: imageUrls, // Add the image URLs to the new catalog
        isPublic: isPublic,
      };

      try {
        const catalogId = await createCatalog(auth.currentUser.uid, newCatalog);
        if (isPublic) {
          const userData = await fetchUserData(auth.currentUser.uid);
          await addToPublicCatalogList(
            auth.currentUser.uid,
            userData.username,
            newCatalog,
            catalogId
          );
        }
        navigation.navigate("View Catalog", {});
      } catch (e) {
        console.error("Error saving catalog data: ", e);
      }
    } catch (error) {
      console.error("Error while creating catalog: ", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  return (
    <>
    <Appbar.Header>
      <Appbar.Content title="Create New Catalog"/>
    </Appbar.Header>
    <View style={styles.container}>

      <ScrollView style={styles.content}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ marginRight: 10, marginBottom: 15 }}>
                Add Item Photos
              </Text>
              <AntDesign name="pluscircleo" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.imagesContainer}>
          {selectedImages.map((imageUri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </View>
          ))}
        </View>
        <TextInput
          placeholder="Name Your Catalog"
          value={catalogName}
          onChangeText={setCatalogName}
          style={[styles.input, { marginTop: 100 }]}
        />
        <TextInput
          placeholder="Category"
          value={catalogCategory}
          onChangeText={setCatalogCategory}
          style={styles.input}
        />
        <TextInput
          placeholder="Describe The Catalog"
          value={catalogDescription}
          onChangeText={setCatalogDescription}
          multiline={true}
          style={styles.descriptionInput}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Public Catalog</Text>
          <TouchableOpacity
            style={[
              styles.switchButton,
              isPublic ? styles.switchButtonOn : null,
            ]}
            onPress={() => setIsPrivate(!isPublic)}
          >
            <Text style={styles.switchButtonText}>
              {isPublic ? "ON" : "OFF"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateCatalog}
          >
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  addPhotoButton: {
    width: "48%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c7c4bf",
    marginVertical: 5,
    marginTop: 40,
    borderRadius: 10,
    padding: 10,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  imageContainer: {
    width: "30%",
    aspectRatio: 1,
    margin: "1%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  descriptionInput: {
    height: 160,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  createButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
  },
  switchButton: {
    padding: 5,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  switchButtonOn: {
    backgroundColor: "#007bff",
  },
  switchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
