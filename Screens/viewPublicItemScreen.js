import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
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

  useEffect(() => {
    const getItemData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log(`Fetching item details for user: ${user.uid}`);
          console.log(`Selected catalog: ${selectedCatalog.publicCatalogId}`);
          console.log(`Selected item: ${selectedItem.publicItemId}`);
          const attributeData = await fetchPublicAttributes(
            selectedCatalog.publicCatalogId,
            selectedItem.publicItemId
          );
          setAttributes(attributeData);
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
      isMounted = false;
      unsubscribe();
    };
  }, [navigation, selectedCatalog.id, selectedItem.id]);

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
      <RNPText variant="headlineSmall" style={styles.catalogName}>
        {selectedCatalog.name}
      </RNPText>
      <RNPText variant="displaySmall" style={styles.itemName}>
        {selectedItem.name}
      </RNPText>
      <ScrollView style={styles.attributesContainer}>
        <View style={styles.attributeRow}>
          <Text style={styles.attributeName}>Value</Text>
          <Text style={[styles.attributeValue, styles.topAttributeValue]}>
            {selectedItem.value}
          </Text>
        </View>
        <View style={styles.attributeRow}>
          <Text style={styles.attributeName}>Description</Text>
          <Text style={[styles.attributeValue, styles.topAttributeValue]}>
            {selectedItem.description}
          </Text>
        </View>
        {attributes.map((attr) => (
          <View key={attr.id} style={styles.attributeRow}>
            <Text style={styles.attributeName}>{attr.attributeName}</Text>
            <Text style={styles.attributeValue}>{attr.attributeValue}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  catalogName: {
    fontSize: 20,
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
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  designatedImage: {
    width: "100%",
    height: 250,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: "center",
  },
  topAttributesContainer: {
    marginBottom: 20,
    textAlign: "center",
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
