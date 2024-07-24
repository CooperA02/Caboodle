import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { auth, fetchPublicItems } from "../firebaseConfig";
import { Appbar, Button, Divider, List, Text } from "react-native-paper";

export default function ViewPublicCatalogScreen({ navigation, route }) {
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getItemData = async () => {
      try {
        const user = auth.currentUser;
        if (user && route.params && route.params.selectedCatalog) {
          setSelectedCatalog(route.params.selectedCatalog);
          const itemData = await fetchPublicItems(
            route.params.selectedCatalog.publicCatalogId
          );
          setItems(itemData);
        } else {
          console.log(
            "User is not authenticated or selectedCatalog is missing"
          );
        }
      } catch (error) {
        console.error("Error fetching Item:", error.message);
      }
    };

    getItemData();

    return () => {};
  }, [route.params?.selectedCatalog]);

  // Check if selectedCatalog is null or undefined
  if (!selectedCatalog) {
    return null; // or return loading indicator or some fallback UI
  }

  const handleNavigateToViewItemScreen = (itemId) => {
    const selectedItem = items.find((item) => item.publicItemId === itemId);
    navigation.navigate("View Public Item", {
      selectedItem: selectedItem,
      selectedCatalog: selectedCatalog,
    });
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={selectedCatalog.name} />
      </Appbar.Header>
      <Text style={styles.catalogName}>
        Created By: {selectedCatalog.userName}
      </Text>
      <Text style={styles.catalogName}>
        Description: {selectedCatalog.catalogDescription}
      </Text>
      <ScrollView style={styles.itemsContainer}>
        <List.Section>
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>Item</Text>
            <Text style={styles.itemName}>Value</Text>
            <Text style={styles.itemName}>Description</Text>
          </View>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleNavigateToViewItemScreen(item.publicItemId)}
              style={styles.itemRow}
            >
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemName}>{item.itemValue}</Text>
                <Text style={styles.itemName}>{item.itemDescription}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </List.Section>
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
