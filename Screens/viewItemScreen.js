
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { auth, fetchItem } from "../firebaseConfig";

export default function ViewItemScreen({ navigation, route }) {
  const { selectedItem, selectedCatalog } = route.params;
  const [attributes, setAttributes] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Initialize with 0 to show the first image

  useEffect(() => {
    let isMounted = true;

    const getItemData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log(`Fetching item details for user: ${user.uid}`);
          const itemData = await fetchItem(
            user.uid,
            selectedCatalog.id,
            selectedItem.id
          );
          if (isMounted) {
            setAttributes(itemData.attributes || []);
            setImages(itemData.images || []);
            selectedItem.name = itemData.name; // Update the selectedItem name
          }
        } else {
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.error("Error fetching item details:", error.message);
        setError(error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true); // Reset loading state when the screen is focused
      setError(null); // Reset error state when the screen is focused
      getItemData();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigation, selectedCatalog.id, selectedItem.id]);

  const handleAddAttribute = () => {
    navigation.navigate("CreateAttributeScreen", {
      selectedItem,
      selectedCatalog,
    });
  };

  const handleDeleteAttribute = (attributeId) => {
    Alert.alert(
      "Delete Attribute",
      "Are you sure you want to delete this attribute?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () =>
            setAttributes(attributes.filter((attr) => attr.id !== attributeId)),
        },
      ],
      { cancelable: false }
    );
  };

  const handleEditAttribute = (attributeId) => {
    navigation.navigate("EditAttributeScreen", {
      attributeId,
      selectedCatalog: selectedCatalog,
      selectedItem: selectedItem,
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Text style={styles.goBackButtonText}>Go Back</Text>
      </TouchableOpacity>
      <Text style={styles.itemName}>{selectedItem.name}</Text>
      {images.length > 0 && (
        <Image
          source={{ uri: images[selectedImageIndex] }}
          style={styles.designatedImage}
          resizeMode="contain" // Ensures the image is not squished
        />
      )}
      <ScrollView horizontal contentContainerStyle={styles.imagesContainer}>
        {images.map((imageUri, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageContainer}
            onPress={() => setSelectedImageIndex(index)}
          >
            <Image source={{ uri: imageUri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>


      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.addAttributeButton}
          onPress={handleAddAttribute}
        >
          <AntDesign name="pluscircleo" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <AntDesign name="closecircle" size={24} color="white" />
          </TouchableOpacity>
          <ImageZoom
            cropWidth={Dimensions.get("window").width}
            cropHeight={Dimensions.get("window").height}
            imageWidth={Dimensions.get("window").width}
            imageHeight={Dimensions.get("window").height}
          >
            <Image
              source={{ uri: images[selectedImageIndex] }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </ImageZoom>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 40,
  },
  goBackButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  goBackButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  designatedImage: {
    width: "100%", // Fill almost the full width of the screen
    height: 300, // Increased height for better display
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: "center", // Center the image horizontally
  },
  attributesContainer: {
    marginBottom: 20,
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  attributeName: {
    fontSize: 18,
  },
  attributeValue: {
    fontSize: 18,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addAttributeButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  imagesContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  imageContainer: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
});
