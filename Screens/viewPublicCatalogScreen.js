import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import {
  auth,
  fetchPublicItems,
  fetchChats,
  createChat,
} from "../firebaseConfig";
import { Appbar, List, Text } from "react-native-paper";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

export default function ViewPublicCatalogScreen({ navigation, route }) {
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [items, setItems] = useState([]);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    const getItemData = async () => {
      try {
        const user = auth.currentUser;
        if (user && route.params && route.params.selectedCatalog) {
          setSelectedCatalog(route.params.selectedCatalog);
          const itemData = await fetchPublicItems(
            route.params.selectedCatalog.publicCatalogId
          );
          console.log("Fetched public items:", itemData);
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

  const handleChatWithUser = async (catalog) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("User not authenticated");
      return;
    }
    console.log("User Checked");
    const chats = await fetchChats(currentUser.uid);
    let existingChat = null;
    console.log("Fetched Chats");
    for (const chat of chats) {
      if (
        (chat.user1Id === currentUser.uid && chat.user2Id === catalog.userId) ||
        (chat.user1Id === catalog.userId && chat.user2Id === currentUser.uid)
      ) {
        existingChat = chat;
        break;
      }
    }
    console.log("Existing Chat Checked");
    let chatId;
    if (existingChat) {
      chatId = existingChat.chatId;
    } else {
      chatId = await createChat(
        currentUser.uid,
        catalog.userId,
        currentUser.displayName,
        catalog.userName
      );
    }

    navigation.navigate("UserChatScreen", {
      chatId: chatId,
      username: catalog.userName,
    });
  };

  const parseValue = (value) => {
    if (typeof value === "string") {

      const numericValue = parseFloat(value.replace(/[$,]/g, ""));
      
      return isNaN(numericValue) ? Number.NEGATIVE_INFINITY : numericValue;
    }
    
    return value;
  };

  const handleSort = (criteria) => {
    let order = "asc";
    if (sortCriteria === criteria && sortOrder === "asc") {
      order = "desc";
    }
    setSortCriteria(criteria);
    setSortOrder(order);

    const sortedItems = [...items].sort((a, b) => {
      if (criteria === "itemName") {
        return order === "asc"
          ? a.itemName.localeCompare(b.itemName)
          : b.itemName.localeCompare(a.itemName);
      } else if (criteria === "itemValue") {
        const aValue = parseValue(a.itemValue);
        const bValue = parseValue(b.itemValue);
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    setItems(sortedItems);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={selectedCatalog.catalogName} />
      </Appbar.Header>
      <View style={styles.headerContainer}>
        <Text style={styles.catalogName}>Owner: {selectedCatalog.userName}</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("News Feed Filtered", {
                user: selectedCatalog.userId,
              })
            }
          >
            <AntDesign name="user" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChatWithUser(selectedCatalog)}
          >
            <MaterialCommunityIcons name="chat" color="black" size={26} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.catalogDescription}>Description: {selectedCatalog.catalogDescription}</Text>
      <ScrollView style={styles.itemsContainer}>
        <List.Section>
          <View style={styles.itemDetailsHeader}>
            <TouchableOpacity onPress={() => handleSort("itemName")}>
              <Text style={styles.itemNameHeader}>
                Item {sortCriteria === "itemName" && (sortOrder === "asc" ? "↑" : "↓")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSort("itemValue")}>
              <Text style={styles.itemValueHeader}>
                Value {sortCriteria === "itemValue" && (sortOrder === "asc" ? "↑" : "↓")}
              </Text>
            </TouchableOpacity>
            <Text style={styles.itemDescriptionHeader}>Description</Text>
          </View>
          {items.map((item) => (
            <TouchableOpacity
              key={item.publicItemId}
              onPress={() => handleNavigateToViewItemScreen(item.publicItemId)}
              style={styles.itemRow}
            >
              {item.images && item.images.length > 0 ? (
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.image}
                />
              ) : item.itemImages && item.itemImages.length > 0 ? (
                <Image
                  source={{ uri: item.itemImages[0] }}
                  style={styles.image}
                />
              ) : null}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemValue}>{item.itemValue}</Text>
                <Text style={styles.itemDescription}>{item.itemDescription}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </List.Section>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  catalogName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 25,
    gap: 40,
  },
  catalogDescription: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 20,
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
  image: {
    width: 50,
    height: 75,
    marginRight: 10,
    marginLeft: 10,
  },
  itemDetailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  itemNameHeader: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    paddingLeft: 70,
  },
  itemValueHeader: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginLeft: 50,
  },
  itemDescriptionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 2,
    textAlign: "center",
    paddingRight: 10,
  },
  itemDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 15,
    flex: 1,
    textAlign: "left",
  },
  itemValue: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  itemDescription: {
    fontSize: 14,
    flex: 2,
    color: "#666",
    textAlign: "left",
  },
});
