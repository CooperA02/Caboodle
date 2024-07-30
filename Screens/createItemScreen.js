import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Text, Appbar, TextInput } from "react-native-paper";
import { auth, createItem, addToPublicItemList } from "../firebaseConfig";

export default function CreateItemScreen({ navigation, route }) {
  const { selectedCatalog } = route.params;
  const [itemName, setItemName] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const handleCreateItem = async () => {
    const newItem = {
      name: itemName,
      value: itemValue,
      description: itemDescription,
    };

    try {
      if (selectedImages.length === 0) {
        throw new Error("Please add at least one photo.");
      }

      console.log(
        "Creating item with data:",
        newItem,
        "and images:",
        selectedImages
      );

      const itemId = await createItem(
        auth.currentUser.uid,
        selectedCatalog.id,
        newItem,
        selectedImages
      );

      console.log("Item created successfully.");

      if (selectedCatalog.isPublic) {
        await addToPublicItemList(
          auth.currentUser.uid,
          selectedCatalog.id,
          selectedCatalog.publicId,
          itemId,
          newItem
        );
        console.log("Item added to public list.");
      }

      navigation.navigate("View Catalog", {
        selectedCatalog: selectedCatalog,
      });
    } catch (e) {
      console.error("Error saving item data: ", e);
      alert("An error occurred while creating the item. Please try again.");
    }
  };

  const pickImage = async () => {
    try {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
        alert(
          "Sorry, we need camera and media library permissions to make this work!"
        );
        return;
      }

      Alert.alert(
        "Add Photo",
        "Choose an option",
        [
          { text: "Take Photo", onPress: () => openCamera() },
          { text: "Choose from Library", onPress: () => openImageLibrary() },
          { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true }
      );
    } catch (e) {
      console.error("Error requesting permissions: ", e);
      alert(
        "An error occurred while requesting permissions. Please try again."
      );
    }
  };

  const openCamera = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1, // Adjust quality to reduce size
      });

      if (!result.cancelled && result.assets) {
        const imageUris = result.assets.map((asset) => asset.uri);
        setSelectedImages((prevImages) => [...prevImages, ...imageUris]);
      }
    } catch (e) {
      console.error("Error opening camera: ", e);
      alert("An error occurred while opening the camera. Please try again.");
    }
  };

  const openImageLibrary = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.1,
      });

      if (!result.cancelled && result.assets) {
        const imageUris = result.assets.map((asset) => asset.uri);
        setSelectedImages((prevImages) => [...prevImages, ...imageUris]);
      }
    } catch (e) {
      console.error("Error opening image library: ", e);
      alert(
        "An error occurred while opening the image library. Please try again."
      );
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Create New Item" />
      </Appbar.Header>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
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
          <TextInput
            placeholder="Description of Item"
            value={itemDescription}
            onChangeText={setItemDescription}
            style={styles.descriptionInput}
            multiline={true}
            numberOfLines={4}
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
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    paddingHorizontal: 20,
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