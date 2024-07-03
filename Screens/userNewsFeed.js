// "But it should never fail" -- every programmer be like after making a small change

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Header from "../Components/header";
import {
  Searchbar,
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  Paragraph,
  Text as RNPText,
  Appbar,
} from "react-native-paper";
import { auth, fetchPublicCatalogs } from "../firebaseConfig";

const windowWidth = Dimensions.get("window").width;

export default function UserNewsFeed({ navigation, route }) {
  const [catalogs, setCatalogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getCatalogData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const catalogData = await fetchPublicCatalogs();
          setCatalogs(catalogData);
        } else {
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.error("Error fetching Catalog data:", error.message);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      getCatalogData();
    });

    return unsubscribe;
  }, [navigation, route]);

  const handleCatalogSelection = (catalog) => {
    navigation.navigate("View Public Catalog", { selectedCatalog: catalog });
  };

  const handleSearch = () => {
    // Search functionality remade after ui refresh -- placeholder for testing
    console.log("Searching for:", searchQuery);
  };

  return (
    <TouchableWithoutFeedback onPressOut={() => Keyboard.dismiss()}>
      <>
        <Appbar.Header>
          <Appbar.Content title="Your Feed" />
          <Appbar.Action
            icon="account-outline"
            onPress={() => navigation.navigate("Profile")}
          />
        </Appbar.Header>
        {/* What worked yesterday is broken today.  Replaced with text till fix pushed. Please let this be the last time*/}
        <ScrollView style={styles.catalogsContainer}>
          <View style={styles.row}>
            {catalogs.map((catalog) => (
              <Card
                key={catalog.id}
                style={styles.card}
                mode="elevated"
                onPress={() => handleCatalogSelection(catalog)}
              >
                {/* TODO: Catalog cover images are not displaying. Tyler and Desmond to work on.*/}
                <Card.Cover
                  source={{
                    uri:
                      catalog.images && catalog.images.length > 0
                        ? catalog.images[0]
                        : "https://via.placeholder.com/150",
                  }}
                />
                <Card.Title
                  title={catalog.catalogName}
                  subtitle={`by ${catalog.userName}`}
                  titleStyle={{
                    fontFamily: "System",
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#333",
                  }}
                  subtitleStyle={{
                    fontFamily: "System",
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "#666",
                  }}
                />
                <Card.Content>
                  <RNPText variant="labelMedium">
                    {/* For the Feed, this description will be shown unlike the search page*/}
                    Description: {catalog.description}
                    Category: {catalog.category}
                  </RNPText>
                </Card.Content>
              </Card>
            ))}
          </View>
        </ScrollView>
      </>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchbar: {
    margin: 0,
  },
  searchButton: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  catalogsContainer: {
    width: "100%",
    length: "50%",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  card: {
    width: "48%", // Adjust this value to set more landscape, less portrait styled-cards
    marginVertical: 5,
    borderRadius: 15, // Okay...for now
  },
});
