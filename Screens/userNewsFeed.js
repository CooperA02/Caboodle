import React, { useState, useEffect } from "react";
import { View, TouchableWithoutFeedback, StyleSheet, ScrollView, Dimensions, Keyboard } from "react-native";
import { Appbar, Card, Text as RNPText } from "react-native-paper";
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
    console.log("Selected catalog:", catalog.publicCatalogId);
    navigation.navigate("View Public Catalog", {
      selectedCatalog: catalog,
      modalPresentationStyle: "pageSheet",
    });
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
          <Appbar.Action icon="account-outline" onPress={() => navigation.navigate("Profile")} />
        </Appbar.Header>
        <ScrollView style={styles.catalogsContainer}>
          <View style={styles.row}>
            {catalogs.map((catalog) => (
              <Card
                key={catalog.publicCatalogId}
                style={styles.card}
                mode="elevated"
                onPress={() => handleCatalogSelection(catalog)}
              >
                {/* TODO: Catalog cover images are not displaying. Tyler and Desmond to work on.*/}
                <Card.Cover
                  source={{
                    uri: catalog.catalogImages && catalog.catalogImages.length > 0
                      ? catalog.catalogImages[0]
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
                  }}
                  subtitleStyle={{
                    fontFamily: "System",
                    fontSize: 14,
                    fontStyle: "italic",
                  }}
                />
                <Card.Content>
                  <RNPText variant="labelMedium">
                    Category: {catalog.catalogCategory} {/* Ensure this accesses the correct field */}
                  </RNPText>
                  <RNPText variant="labelMedium">
                    {catalog.catalogDescription}
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
