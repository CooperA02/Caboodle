import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Dimensions, Alert, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Header from '../Components/header'; // Import Header component
import Footer from '../Components/footer'; // Import Footer component
import { AntDesign, Entypo } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';

//import { auth, createCatalog } from "../firebaseConfig"; connection to firebase
//Option for users to view the news feed for collections/collectors they follow to be implemented here during Sprint 3

const windowWidth = Dimensions.get("window").width;

export default function UserHomeScreen({ navigation, route }) {
  const [collections, setCollections] = useState([
    { id: 1, name: "Collection 1", views: 10, followers: 50 }, //4 collections added for testing
    { id: 2, name: "Collection 2", views: 100, followers: 75 },
    { id: 3, name: "Collection 3", views: 700, followers: 90 },
    { id: 4, name: "Collection 4", views: 400, followers: 120 },
  ]);
  const [sortOrder, setSortOrder] = useState("mostPopular"); // Consolidated state

  useEffect(() => {
    // Fetch collections the user follows from backend
    // This is just a placeholder, replace with actual fetch call
    //const fetchedCollections = [
      //{ id: 5, name: "Fetched Collection 1", views: 500, followers: 150 },
    //];
    //setCollections(fetchedCollections);
  }, []);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder); // Update sortOrder state
    let sortedCollections;
    switch (newSortOrder) {
      case "mostPopular":
        sortedCollections = [...collections].sort((a, b) => b.views - a.views);
        break;
      case "alphabetical":
        sortedCollections = [...collections].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recentlyFollowed":
        sortedCollections = [...collections].sort((a, b) => b.followers - a.followers);
        break;
      default:
        sortedCollections = collections;
    }
    setCollections(sortedCollections); // Updates collection state based on sortOrder
  };



  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="Home" />
      <View style={styles.content}>
        <TouchableWithoutFeedback onPress={toggleDropdown}>
          <View style={[styles.button]}>
            <Entypo name="dots-three-vertical" size={24} color="#000" />
          </View>
        </TouchableWithoutFeedback>
        <RNPickerSelect
          onValueChange={(value) => handleSortChange(value)}
          items={[
            { label: 'Most Popular', value: 'mostPopular' },
            { label: 'Alphabetical', value: 'alphabetical' },
            { label: 'Recently Followed', value: 'recentlyFollowed' },
          ]}
          value={sortOrder}
          style={{
            inputIOS: {
              color: 'black',
            },
            inputAndroid: {
              color: 'black',
            },
          }}
        />
        <ScrollView style={styles.collectionsContainer}>
          <View style={styles.row}>
            {collections.map((collection) => (
              <TouchableOpacity
                key={collection.id}
                style={styles.collectionItem}
                onPress={() => navigation.navigate("ViewCollectionScreen", { selectedCollection: collection })}
              >
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }}
                  style={styles.collectionImage}
                />
                <Text style={styles.collectionName}>{collection.name}</Text>
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
    justifyContent: "flex-start", 
    paddingTop: 30, 
    paddingHorizontal: 20,
  },
  button: {
    position: 'absolute',
    right: 30, 
    top: 20,
  },
  sortingOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    width: "100%",
  },
  sortOption: {
    backgroundColor: "#ddd",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  sortOptionText: {
    fontSize: 14,
  },
  viewModeToggle: {
    backgroundColor: "#007bff",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  viewModeToggleText: {
    color: "#fff",
    fontSize: 14,
  },
  collectionsContainer: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  collectionItem: {
    width: "48%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  collectionImage: {
    width: "70%",
    height: "70%",
    marginBottom: 10,
  },
  collectionName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});