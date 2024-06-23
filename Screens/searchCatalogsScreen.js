// SearchCollectionsScreen.js
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
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Header from "../Components/header";
import Footer from "../Components/footer";
import { auth, fetchPublicCatalogs } from "../firebaseConfig";

const windowWidth = Dimensions.get("window").width;

export default function SearchCatalogsScreen({ navigation, route }) {
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
    navigation.navigate("ViewCatalogScreen", { selectedCatalog: catalog });
  };

  const handleSearch = () => {
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="Search Collections" />
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search for people or catalogs"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchBar}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <AntDesign name="search1" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Recommended Catalogs</Text>
        <ScrollView style={styles.catalogsContainer}>
          <View style={styles.row}>
            {catalogs.map((catalog) => (
              <TouchableOpacity
                key={catalog.id}
                style={styles.catalogItem}
                onPress={() => handleCatalogSelection(catalog)}
              >
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }}
                  style={styles.catalogImage}
                />
                <Text style={styles.catalogName}>{catalog.catalogName}</Text>
                <Text>{catalog.userName}</Text>
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
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  searchButton: {
    height: 40,
    width: 40,
    backgroundColor: "gray",
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
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  catalogItem: {
    width: "48%", // Set width to occupy half of the row
    aspectRatio: 1, // Maintain aspect ratio to create a square
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
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
