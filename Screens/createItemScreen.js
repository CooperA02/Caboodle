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
import { auth, createItem } from "../firebaseConfig"; // Import the Firebase auth object and authentication functions

export default function CreateItemScreen({ navigation, route }) {
  const { selectedCatalog } = route.params;
  const [itemName, setItemName] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const handleCreateItem = async () => {
    const newItem = {
      name: itemName,
      value: itemValue,
    };
  
    try {
      await createItem(auth.currentUser.uid, selectedCatalog.id, newItem, selectedImages);
      navigation.navigate("ViewCatalogScreen", {
        selectedCatalog: selectedCatalog,
      });
    } catch (e) {
      console.error("Error saving item data: ", e);
      alert("An error occurred while creating the item. Please try again.");
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
      quality: 0.5, // Adjust quality to reduce size
    });
  
    if (!result.canceled) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };  

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="Create New Item" />
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
          placeholder="Name of Item"
          value={itemName}
          onChangeText={setItemName}
          style={[styles.input, { marginTop: 100 }]}
        />
        <TextInput
          placeholder="Value of Item"
          value={itemValue}
          onChangeText={setItemValue}
          style={styles.input}
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
            onPress={handleCreateItem}
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
