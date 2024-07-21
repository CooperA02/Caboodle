import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, Pressable, Keyboard, TouchableWithoutFeedback, TextInput, FlatList } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Searchbar, Avatar, Button, Card, Chip, IconButton, Paragraph, Text as RNPText, Appbar, useTheme, ActivityIndicator, Text } from 'react-native-paper';
import { TouchableRipple, Switch } from 'react-native-paper';
import { PreferencesContext } from '../Components/preferencesContext';
import { fetchPublicCatalogs, fetchPublicItems } from "../firebaseConfig"; // Ensure these are imported correctly

const windowWidth = Dimensions.get("window").width;

export default function SearchCatalogsScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text) => {
    setSearchQuery(text);
    setLoading(true);
    try {
      const publicCatalogs = await fetchPublicCatalogs();
      const filteredCatalogs = publicCatalogs.filter(catalog => catalog.catalogName.toLowerCase().includes(searchQuery.toLowerCase()));
      setCatalogs(filteredCatalogs);
    } catch (error) {
      console.error('Error fetching catalogs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCatalogSelect = (catalog) => {
    console.log("Selected catalog:", catalog.publicCatalogId);
    navigation.navigate("View Public Catalog", {
      selectedCatalog: catalog,
      modalPresentationStyle: "pageSheet",
    });
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Caboodle"/>
        <Appbar.Action icon="account-outline" onPress={() => navigation.navigate('Profile')} />
      </Appbar.Header>
      <View style={{ flex: 1 }}>
        <Searchbar
          placeholder="Search Public Catalogs"
          value={searchQuery}
          onSubmitEditing={handleSearch}
          onChangeText={handleSearch}
        />
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <ScrollView style={styles.catalogsContainer}>
            <View style={styles.row}>
              {catalogs.map((catalog) => (
                <Card
                  key={catalog.id}
                  style={styles.card}
                  mode="elevated"
                  onPress={() => handleCatalogSelect(catalog)}
                >
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
                    }}
                    subtitleStyle={{
                      fontFamily: "System",
                      fontSize: 14,
                      fontStyle: "italic",
                    }}
                  />
                  <Card.Content>
                    <RNPText variant="labelMedium">
                      Category: {catalog.category}
                    </RNPText>
                    <RNPText variant="labelMedium">
                      {catalog.description}
                    </RNPText>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </>
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
    length: "50%",

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
  card: {
    width: "48%", // Adjust this value to set more landscape, less portrait styled-cards
    marginVertical: 5,
    borderRadius: 15, // Okay...for now
  },
    row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
});