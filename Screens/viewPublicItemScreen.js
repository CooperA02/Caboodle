import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
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
    selectedItem.images && selectedItem.images.length > 0
      ? selectedItem.images[0]
      : selectedItem.itemImages && selectedItem.itemImages.length > 0
      ? selectedItem.itemImages[0]
      : null
  );
  const [modalVisible, setModalVisible] = useState(false);

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
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: designatedImage }}
              style={styles.designatedImage}
            />
          </TouchableOpacity>
        )}
        <View style={styles.imagesContainer}>
          {selectedItem.images && selectedItem.images.length > 0
            ? selectedItem.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setDesignatedImage(image)}
                >
                  <Image source={{ uri: image }} style={styles.itemImage} />
                </TouchableOpacity>
              ))
            : selectedItem.itemImages &&
              selectedItem.itemImages.length > 0 &&
              selectedItem.itemImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setDesignatedImage(image)}
                >
                  <Image source={{ uri: image }} style={styles.itemImage} />
                </TouchableOpacity>
              ))}
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
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
          <ImageZoom
            cropWidth={Dimensions.get("window").width}
            cropHeight={Dimensions.get("window").height}
            imageWidth={Dimensions.get("window").width}
            imageHeight={Dimensions.get("window").width * 1.5} 
          >
            <Image
              style={styles.fullScreenImage}
              source={{ uri: designatedImage }}
              resizeMode="contain"
            />
          </ImageZoom>
        </View>
      </Modal>
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
    textAlign: "right",
    width: "66%",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
});
