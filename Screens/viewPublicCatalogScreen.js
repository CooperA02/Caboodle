import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
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
          const itemData = await fetchPublicItems(route.params.selectedCatalog.publicCatalogId);
          console.log('Fetched public items:', itemData); // Log the fetched items to verify itemImages
          setItems(itemData);
        } else {
          console.log("User is not authenticated or selectedCatalog is missing");
        }
      } catch (error) {
        console.error("Error fetching Item:", error.message);
      }
    };
  
    getItemData();
  }, [route.params?.selectedCatalog]);

  if (!selectedCatalog) {
    return null;
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
      <ScrollView style={styles.itemsContainer}>
        <List.Section>
          {items.map((item) => (
            <TouchableOpacity
              key={item.publicItemId}
              onPress={() => handleNavigateToViewItemScreen(item.publicItemId)}
              style={styles.itemRow}
            >
              {item.itemImages && item.itemImages.length > 0 && (
                <Image source={{ uri: item.itemImages[0] }} style={styles.itemImage} />
              )}
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
