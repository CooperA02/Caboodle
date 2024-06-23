import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  auth,
  fetchItems,
  deleteItems,
  deletePublicItems,
} from "../firebaseConfig";

export default function ViewCatalogScreen({ navigation, route }) {
  const { selectedCatalog } = route.params;
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getItemData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const itemData = await fetchItems(user.uid, selectedCatalog.id);
          setItems(itemData);
        } else {
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.error("Error fetching Item:", error.message);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      getItemData();
    });

    return unsubscribe;
  }, [navigation, selectedCatalog.id]);

  const handleAddItem = () => {
    navigation.navigate("CreateItemScreen", {
      selectedCatalog: selectedCatalog,
    });
  };

  const handleDeleteItem = (itemId) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handleDelete(itemId),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDelete = async (itemId) => {
    try {
      deleteItems(auth.currentUser.uid, selectedCatalog.id, itemId);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item data:", error.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack(); // Go back to the Catalog Screen
  };

  const handleNavigateToViewItemScreen = (itemId) => {
    const selectedItem = items.find((item) => item.id === itemId);
    navigation.navigate("ViewItemScreen", {
      selectedItem: selectedItem,
      selectedCatalog: selectedCatalog,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Text style={styles.goBackButtonText}>Go Back</Text>
      </TouchableOpacity>
      <Text style={styles.catalogName}>{selectedCatalog.name}</Text>

      <ScrollView style={styles.itemsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleNavigateToViewItemScreen(item.id)}
            style={styles.itemRow}
          >
            <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                <AntDesign name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
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
  catalogName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemsContainer: {
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 18,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
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
});
