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
import { auth, fetchAttributes, fetchItems } from "../firebaseConfig";

export default function ViewItemScreen({ navigation, route }) {
  const { selectedItem, selectedCatalog } = route.params;
  const [attributes, setAttributes] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getItemData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log(`Fetching item details for user: ${user.uid}`);
          const itemData = await fetchItems(
            user.uid,
            selectedCatalog.id,
            selectedItem.id
          );
          setAttributes(itemData.attributes || []);
          setImages(itemData.images || []);
        } else {
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.error("Error fetching Item details:", error.message);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      getItemData();
    });

    return unsubscribe;
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Text style={styles.goBackButtonText}>Go Back</Text>
      </TouchableOpacity>
      <Text style={styles.itemName}>{selectedItem.name}</Text>
      <ScrollView style={styles.attributesContainer}>
        {attributes.map((attr) => (
          <View key={attr.id} style={styles.attributeRow}>
            <Text style={styles.attributeName}>{attr.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteAttribute(attr.id)}>
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <ScrollView horizontal contentContainerStyle={styles.imagesContainer}>
  {images.map((imageUri, index) => (
    <View key={index} style={styles.imageContainer}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      {/* Log image URIs for debugging */}
      {console.log("Image URI:", imageUri)}
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
  attributesContainer: {
    marginBottom: 20,
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
