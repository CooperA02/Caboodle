import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Header from "../Components/header";
import Footer from "../Components/footer";
import { auth, createChat, fetchChats } from "../firebaseConfig";

const windowWidth = Dimensions.get("window").width;

export default function ChatListScreen({ navigation, route }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const getChatData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const chatData = await fetchChats(user.uid);
          setChats(chatData);
        } else {
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.error("Error fetching Catalog data:", error.message);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      getChatData();
    });

    return unsubscribe;
  }, [navigation, route]);

  const handleCreateNewChat = async () => {
    const newChat = await createChat(auth.currentUser.uid, null, "Hello!");
  };

  const handleChatSelection = (chat) => {
    setSelectedChat(chat);
    navigation.navigate("chatScreen", { selectedChat: chat });
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="Your Catalogs" />
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.createCatalogButton, { flex: 2 }]}
            onPress={handleCreateNewCatalog}
          >
            <Text style={styles.createCatalogButtonText}>
              Create New Catalog +
            </Text>
            <AntDesign name="pluscircleo" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, { flex: 1 }]}
            onPress={handleToggleFilterMenu}
          >
            <Entypo name="select-arrows" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {filterMenuVisible && (
          <View style={styles.filterMenu}>
            <TouchableOpacity
              style={styles.filterMenuItem}
              onPress={handleFilterCatalogs}
            >
              <Text style={styles.filterMenuItemText}>Sort by Name</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterMenuItem}
              onPress={handleFilterCatalogs}
            >
              <Text style={styles.filterMenuItemText}>Sort by Size</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterMenuItem}
              onPress={handleFilterCatalogs}
            >
              <Text style={styles.filterMenuItemText}>Sort by Time</Text>
            </TouchableOpacity>
          </View>
        )}
        <ScrollView style={styles.catalogsContainer}>
          <View style={styles.row}>
            {catalogs.map((catalog) => (
              <TouchableOpacity
                key={catalog.id}
                style={[
                  styles.catalogItem,
                  catalog === selectedCatalog
                    ? styles.selectedCatalogItem
                    : null,
                ]}
                onPress={() => handleCatalogSelection(catalog)}
                onLongPress={() => handleLongPress(catalog)}
              >
                {catalog.images && catalog.images.length > 0 ? (
                  <Image
                    source={{ uri: catalog.images[0] }}
                    style={styles.catalogImage}
                  />
                ) : (
                  <Image
                    source={{ uri: "https://via.placeholder.com/150" }}
                    style={styles.catalogImage}
                  />
                )}
                <Text style={styles.catalogName}>{catalog.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
  createCatalogButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "48%",
  },
  createCatalogButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  filterButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
  },
  filterMenu: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  filterMenuItem: {
    paddingVertical: 5,
  },
  filterMenuItemText: {
    fontSize: 16,
  },
  catalogsContainer: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  catalogItem: {
    width: "48%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  selectedCatalogItem: {
    backgroundColor: "#ccc",
  },
  catalogImage: {
    width: "70%",
    height: "70%",
    marginBottom: 10,
  },
  catalogName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
