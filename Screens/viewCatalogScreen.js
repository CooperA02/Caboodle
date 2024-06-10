import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, fetchItems } from "../firebaseConfig";

export default function ViewCatalogScreen({ navigation, route }) {
  const { selectedCatalog } = route.params;
  const [items, setItems] = useState([]);

  // Fetching items from a server or local storage /temp for demo
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
  }, [navigation, route, items]);

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
          onPress: () => setItems(items.filter((item) => item.id !== itemId)),
        },
      ],
      { cancelable: false }
    );
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
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemName: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  goBackButton: {
    alignSelf: "flex-start", // Align to the left
    marginBottom: 20,
  },
  goBackButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff", // Use a contrasting color for the button text
  },
});
