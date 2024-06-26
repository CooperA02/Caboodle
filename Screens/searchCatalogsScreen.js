// Import necessary components and hooks
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Header from "../Components/header";
import { Searchbar, Avatar, Button, Card, Chip, IconButton, Paragraph, Text as RNPText, Appbar } from 'react-native-paper';
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
    navigation.navigate("View Catalog", { selectedCatalog: catalog });
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };


  return (
    <TouchableWithoutFeedback onPressOut={() => Keyboard.dismiss()}>
      <>
        <Appbar.Header>
          <Appbar.Content title="Caboodle"/>
            <Appbar.Action icon="account-outline" onPress={() => navigation.navigate('Profile')} />
        </Appbar.Header>
        <Pressable onPress={handleSearch} style={({ pressed }) => [styles.searchbar, pressed? { opacity: 0.8 } : { opacity: 1 }]}>
          <Searchbar
            placeholder="Search for people or catalogues"
            onChangeText={(query) => setSearchQuery(query)}
            value={searchQuery}
            style={styles.searchbar}
            mode="outlined"
            showDivider={false}
            onIconPress={() => {
              Keyboard.dismiss();
              navigation.goBack();
            }}
            onClearIconPress={() => {
              Keyboard.dismiss();
            }}
          />
        </Pressable>
        <ScrollView style={styles.catalogsContainer}>
          <View style={styles.grid}>
            {catalogs.map((catalog) => (
              <TouchableOpacity key={catalog.id} onPress={() => handleCatalogSelection(catalog)} style={styles.gridItem}>
                <Image source={{ uri: catalog.images && catalog.images.length > 0? catalog.images[0] : "https://via.placeholder.com/150" }} style={styles.image} />
              </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  catalogsContainer: {
    width: "100%",
    backgroundColor: "white",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "32%", // Adjusted for 3 items per row
    marginVertical: 2, //
    marginHorizontal: 2, 
  },
  image: {
    width: "100%", // 
    aspectRatio: 1, //
    resizeMode: "cover", // Cover the entire area of the container without distorting the aspect ratio
  },
});
