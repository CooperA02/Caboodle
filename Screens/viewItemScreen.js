import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { auth, fetchAttributes } from "../firebaseConfig";

export default function ViewItemScreen({ navigation, route }) {
  const { selectedItem, selectedCatalog } = route.params;
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const getAttributeData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log(`Fetching attributes for user: ${user.uid}`);
          const attributeData = await fetchAttributes(
            user.uid,
            selectedCatalog.id,
            selectedItem.id
          );
          setAttributes(attributeData);
        } else {
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.error("Error fetching Attributes:", error.message);
      }
    };
  
    const unsubscribe = navigation.addListener("focus", () => {
      getAttributeData();
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
});
