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
import {
  auth,
  fetchItem,
  deleteAttributes,
  deletePublicAttributes,
} from "../firebaseConfig";
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
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const userId = auth.currentUser.uid;
  const catalogId = selectedCatalog.id;
  const pubCatalogId = selectedCatalog.publicId;
  const itemId = selectedItem.id;
  const pubItemId = selectedItem.publicId;
  console.log('ViewItemScreen check: ', typeof pubCatalogId, typeof pubItemId);
  console.log('ViewItemScreen check: ', pubCatalogId, pubItemId);

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
            selectedItem.name = itemData.name;
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
      setLoading(true);
      setError(null);
      getItemData();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigation, selectedCatalog.id, selectedItem.id]);

  const handleAddAttribute = () => {
    navigation.navigate("Create Attribute", {
      selectedItem,
      selectedCatalog,
    });
  };

  const handleDeleteAttributeConfirm = (attributeId) => {
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
            handleDeleteAttribute(attributeId).then(() => {
              console.log("Attribute deleted successfully");
            }),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteAttribute = async (delAttribute) => {
    await deleteAttributes(
      auth.currentUser.uid,
      selectedCatalog.id,
      selectedItem.id,
      delAttribute.id
    );
    if (selectedCatalog.publicId) {
      await deletePublicAttributes(
        selectedCatalog.publicId,
        selectedItem.publicId,
        delAttribute.publicId
      );
    }
    setAttributes(attributes.filter((attr) => attr.id !== delAttribute.id));
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleImagePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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
      <RNPText variant="headlineSmall" style={styles.catalogName}>
        {selectedCatalog.name}
      </RNPText>
      <RNPText variant="displaySmall" style={styles.itemName}>
        {selectedItem.name}
      </RNPText>
      {images.length > 0 && (
        <TouchableOpacity onPress={handleImagePress}>
          <Image
            source={{ uri: images[selectedImageIndex] }}
            style={styles.designatedImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
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
  {/* Hardcoded Attributes */}
  <View style={styles.attributeRow}>
    <TouchableOpacity onPress={() => navigation.navigate('Edit Attribute', { 
      attribute: { id: 1, name: "Value", value: selectedItem.value },
      userId: userId,
      catalogId: catalogId,
      itemId: itemId
    })
    }>
      <Text style={styles.attributeName}>Value</Text>
      <Text style={[styles.attributeValue, styles.topAttributeValue]}>{selectedItem.value}</Text>
    </TouchableOpacity>
  </View>
  <View style={styles.attributeRow}>
    <TouchableOpacity onPress={() => navigation.navigate('Edit Attribute', { 
      attribute: { id: 2, name: "Description", value: selectedItem.description },
      userId: userId,
      catalogId: catalogId,
      itemId: itemId
    })}>
      <Text style={styles.attributeName}>Description</Text>
      <Text style={[styles.attributeValue, styles.topAttributeValue]}>{selectedItem.description}</Text>
    </TouchableOpacity>
  </View>

  {/* Dynamically Mapped Attributes */}
  {attributes.map((attr) => (
    <View key={attr.id} style={styles.attributeRow}>
      <TouchableOpacity onPress={() => 
      navigation.navigate('Edit Attribute', { 
        attribute: attr,
        userId: userId,
        catalogId: catalogId,
        itemId: itemId,
        pubCatalogId: pubCatalogId,
        pubItemId: pubItemId
      })}>
        <Text style={styles.attributeName}>{attr.name}</Text>
        <Text style={styles.attributeValue}>{attr.value}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteAttributeConfirm(attr)}>
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
    justifyContent: "center",
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
    marginBottom: 50,
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
