import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { auth, fetchPublicAttributes } from "../firebaseConfig";
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
  Text,
} from "react-native-paper";
import ImageZoom from "react-native-image-pan-zoom";

export default function ViewItemScreen({ navigation, route }) {
  const { selectedItem, selectedCatalog } = route.params;
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [designatedImage, setDesignatedImage] = useState(
    selectedItem.images ? selectedItem.images[0] : null
  );

  useEffect(() => {
    const getItemData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log(`Fetching item details for user: ${user.uid}`);
          console.log(`Selected catalog: ${selectedCatalog.publicCatalogId}`);
          console.log(`Selected item: ${selectedItem.publicItemId}`);

          // Fetch attributes
          const attributeData = await fetchPublicAttributes(
            selectedCatalog.publicCatalogId,
            selectedItem.publicItemId
          );
          console.log("Fetched attributes:", attributeData);
          setAttributes(attributeData || []);

          // Log selected item details
          console.log("Selected item details:", selectedItem);
        } else {
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.error("Error fetching item details:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true);
      setError(null);
      getItemData();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, selectedCatalog.publicCatalogId, selectedItem.publicItemId]);

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
      <Appbar.Header>
        <Appbar.Content title={selectedCatalog.name} />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <Text variant="displaySmall" style={styles.itemName}>
          {selectedItem.itemName}
        </Text>
        {designatedImage && (
          <Image
            source={{ uri: designatedImage }}
            style={styles.designatedImage}
          />
        )}
        <View style={styles.imagesContainer}>
          {selectedItem.images && selectedItem.images.length > 0 ? (
            selectedItem.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setDesignatedImage(image)}
              >
                <Image source={{ uri: image }} style={styles.itemImage} />
              </TouchableOpacity>
            ))
          ) : (
            <Text>No images available.</Text>
          )}
        </View>
        <View style={styles.attributesContainer}>
          {attributes && attributes.length > 0 ? (
            attributes.map((attr, index) => (
              <View key={index} style={styles.attributeRow}>
                <Text style={styles.attributeName}>{attr.attributeName}</Text>
                <Text style={styles.attributeValue}>{attr.attributeValue}</Text>
              </View>
            ))
          ) : (
            <Text>No attributes available.</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  designatedImage: {
    width: "100%",
    height: 300,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagesContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignSelf: "center",
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  attributesContainer: {
    marginBottom: 20,
  },
  attributeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  attributeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  attributeValue: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  topAttributeValue: {
    paddingRight: 10,
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
    marginBottom: 5,
  },
  imagesContainer: {
    flexDirection: "row",
    marginBottom: 50,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "90%",
    height: "90%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
});
