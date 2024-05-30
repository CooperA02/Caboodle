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

export default function ViewCatalogScreen({ navigation, route }) {
  const { selectedCatalog } = route.params;
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");

  // Fetching items from a server or local storage /temp for demo
  useEffect(() => {
    setItems([
      { id: 1, name: "Item 1", image: "https://via.placeholder.com/150" },
      { id: 2, name: "Item 2", image: "https://via.placeholder.com/150" },
    ]);
  }, []);

  const handleAddItem = () => {
    if (newItemName.trim() === "") {
      Alert.alert("Error", "Item field cannot be empty");
      return;
    }
    const newItem = { id: items.length + 1, name: newItemName };
    setItems([...items, newItem]);
    setNewItemName("");
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Text style={styles.goBackButtonText}>Go Back</Text>
      </TouchableOpacity>
      <Text style={styles.catalogName}>{selectedCatalog.name}</Text>

      <ScrollView style={styles.itemsContainer}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new item"
          value={newItemName}
          onChangeText={setNewItemName}
        />
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
