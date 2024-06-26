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
import { Searchbar, Avatar, Button, Card, Chip, IconButton, Paragraph, Text as RNPText, Appbar } from 'react-native-paper';


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
    <>
      <RNPText variant="headlineMedium">
        {selectedCatalog.name}
      </RNPText>
      <RNPText variant="displaySmall">
        {selectedItem.name}
      </RNPText>
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
      <ScrollView style={styles.attributesContainer}>
        {attributes.map((attr) => (
          <View key={attr.id} style={styles.attributeRow}>
            <Text style={styles.attributeName}>{attr.name}</Text>
            <Text style={styles.attributeValue}>{attr.value}</Text>
            <TouchableOpacity onPress={() => handleDeleteAttribute(attr.id)}>
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
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

    </>
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
    height: 400, // Increased height for better display
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: "center", // Center the image horizontally
  },
  attributesContainer: {
    marginBottom: 5,
  },
  attributeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
    marginTop: 0,
    marginBottom: 0,
  },
  addAttributeButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginLeft: 30,
    marginBottom: 5, //temporary fix until button is replaced
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
