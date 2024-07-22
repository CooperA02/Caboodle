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
import {
  auth,
  fetchItems,
  deleteItems,
  deletePublicItems,
} from "../firebaseConfig";
import { Appbar, Button, Divider, List, Text } from "react-native-paper";

export default function ViewCatalogScreen({ navigation, route }) {
  const { selectedCatalog } = route.params;
  const [items, setItems] = useState([]);

  const userId = auth.currentUser.uid;
  const catalogId = selectedCatalog.id;
  const pubCatalogId = selectedCatalog.pubCatalogId;

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

    getItemData();

    return () => {};
  }, [selectedCatalog.id]);

  const handleAddItem = () => {
    navigation.navigate("New Item", {
      selectedCatalog: selectedCatalog,
    });
  };

  const handleDeleteItem = (item) => {
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
          onPress: () => handleDelete(item),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDelete = (delItem) => {
    deleteItems(auth.currentUser.uid, selectedCatalog.id, delItem.id); // Await deletion
    deletePublicItems(selectedCatalog.publicId, delItem.publicId); // Delete public item
    setItems(items.filter((item) => item.id !== delItem.id)); // Update local state after deletion
  };

  const handleNavigateToViewItemScreen = (itemId) => {
    const selectedItem = items.find((item) => item.id === itemId);
    navigation.navigate("View Item", {
      selectedItem: selectedItem,
      selectedCatalog: selectedCatalog,
    });
  };

  //temporary styling and formatting
  return (
    <>

      <ScrollView style={styles.itemsContainer}>
        <List.Section title={selectedCatalog.name}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <AntDesign name="pluscircleo" size={24} color="black"/>
          </TouchableOpacity>
        </View>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleNavigateToViewItemScreen(item.id)}
              onLongPress={() =>
                navigation.navigate('Edit Item', { 
                  item: item,
                  userId: userId,
                  catalogId: catalogId,
                  publicCatalogId: pubCatalogId,

                 })
              }
              style={styles.itemRow}
            >
              <Image
                source={{ uri: item.images[0] }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleDeleteItem(item)}>
                  <AntDesign
                    name="delete"
                    size={26}
                    color="red"
                    marginRight={28}
                  />
                </TouchableOpacity>
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
    paddingVertical: 15,
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
    marginLeft: 25,
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