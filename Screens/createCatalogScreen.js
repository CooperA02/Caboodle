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
import Footer from "../Components/footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, createCatalog } from "../firebaseConfig"; // Import the Firebase auth object and authentication functions

export default function CreateCatalogScreen({ navigation }) {
  const [catalogName, setCatalogName] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("");
  const [catalogDescription, setCatalogDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const handleCreateCatalog = async () => {
    // Prepare the catalog data
    const newCatalog = {
      name: catalogName,
      category: catalogCategory,
      description: catalogDescription,
      images: selectedImages,
    };

    try {
      await createCatalog(auth.currentUser.uid, newCatalog);
      navigation.navigate("Catalogs", {});
    } catch (e) {
      console.error("Error saving catalog data: ", e);
    }
  };

  const pickImage = async () => {
    // Request permissions to use the camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    // Open Camera App
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="Create New Catalog" />
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
      <Footer />
    </View>
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
    height: 160, // Increase the height for the description field
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
});
