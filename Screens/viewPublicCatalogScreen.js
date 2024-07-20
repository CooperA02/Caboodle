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
import { auth, fetchPublicItems } from "../firebaseConfig";
import { Appbar, Button, Divider, List } from "react-native-paper";

export default function ViewPublicCatalogScreen({ navigation, route }) {
  const { selectedCatalog } = route.params;
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getItemData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log("catalogId: " + selectedCatalog.publicCatalogId);
          const itemData = await fetchPublicItems(
            selectedCatalog.publicCatalogId
          );
          setItems(itemData);
        } else {
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.error("Error fetching Item:", error.message);
      }
    };

    getItemData();

    return () => {};
  }, [selectedCatalog.publicCatalogId]);

  const handleNavigateToViewItemScreen = (itemId) => {
    console.log("Selected item:", itemId);
    items.map((item) => {
      console.log("Item: " + item.publicItemId);
    });
    const selectedItem = items.find((item) => item.publicItemId === itemId);
    console.log("Selected item:", selectedItem.publicItemId);
    console.log("Selected catalog:", selectedCatalog.publicCatalogId);
    navigation.navigate("View Public Item", {
      selectedItem: selectedItem,
      selectedCatalog: selectedCatalog,
    });
  };

  //temporary styling and formatting
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={selectedCatalog.name} />
      </Appbar.Header>
      <ScrollView style={styles.itemsContainer}>
        <List.Section>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleNavigateToViewItemScreen(item.publicItemId)}
              style={styles.itemRow}
            >
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.itemName}</Text>
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
    backgroundColor: "white",
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
