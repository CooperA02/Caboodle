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
import { Appbar, Button, Divider, List, Text } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons"; // Import icon components from Expo vector icons
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import icon components from Expo vector icons

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
          console.log("Fetched public items:", itemData); // Log the fetched items to verify itemImages
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

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={selectedCatalog.name} />
      </Appbar.Header>
      <View style={styles.buttonContainer}>
        <Text style={styles.catalogName}>
          Created By: {selectedCatalog.userName}
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("News Feed Filtered", {
              user: selectedCatalog.userId,
            })
          } // Navigate to the UserNewsFeedFilteredScreen
          style={styles.profileButton}
        >
          <AntDesign name="user" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleChatWithUser(selectedCatalog)}
          style={styles.profileButton}
        >
          <MaterialCommunityIcons name="chat" color="black" size={26} />
        </TouchableOpacity>
      </View>
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
              key={item.publicItemId}
              onPress={() => handleNavigateToViewItemScreen(item.publicItemId)}
              style={styles.itemRow}
            >
              {item.itemImages && item.itemImages.length > 0 && (
                <Image
                  source={{ uri: item.itemImages[0] }}
                  style={styles.itemImage}
                />
              )}
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "gray",
    padding: 10,
    marginLeft: 10,
  },
});
