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
import {
  auth,
  fetchCatalogs,
  deleteCatalogs,
  deletePublicCatalogs,
} from "../firebaseConfig";
import {
  Card,
  IconButton,
  Paragraph,
  Text as RNPText,
  Appbar,
} from 'react-native-paper';


const windowWidth = Dimensions.get("window").width;

export default function Catalogs({ navigation, route }) {
  const [catalogs, setCatalogs] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const userId = auth.currentUser.uid;

  useEffect(() => {
    const getCatalogData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const catalogData = await fetchCatalogs(user.uid);
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

  const handleCreateNewCatalog = () => {
    navigation.navigate("Create Catalog", { screen: "CreateCatalogScreen", params: { modalPresentationStyle: "pageSheet" } });
  };

  const handleCatalogSelection = (catalog) => {
    setSelectedCatalog(catalog);
    navigation.navigate("View Catalog", {
      selectedCatalog: catalog,
      modalPresentationStyle: "pageSheet"
    });
  };

  const handleToggleFilterMenu = () => {
    setFilterMenuVisible(!filterMenuVisible);
  };

  const handleFilterCatalogs = () => {
    // Logic to filter catalogs
  };

  const handleLongPress = (catalog) => {
    Alert.alert(
      "Delete Catalog",
      "Are you sure you want to delete this catalog?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleDeleteCatalog(catalog) },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteCatalog = (catalogToDelete) => {
    deleteCatalogs(auth.currentUser.uid, catalogToDelete.id);
    if (catalogToDelete.isPublic) {
      deletePublicCatalogs(auth.currentUser.uid, catalogToDelete.id);
    }
    setCatalogs(
      catalogs.filter((catalog) => catalog.id !== catalogToDelete.id)
    );
  };


  return (
    <>
    {/* Redesigned catalog screen.  I'm open to suggestions if anyone has an idea. */}
    <>
      <Appbar.Header>
        <Appbar.Content title="My Catalogs"/>
          <Appbar.Action icon="account-outline" onPress={() => navigation.navigate('Profile')} />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.content}>

          <ScrollView style={styles.catalogsContainer}>
            <View style={styles.row}>
              {catalogs.map((catalog) => (
                <Card
                key={catalog.id}
                style={styles.card}
                mode="elevated"
                onPress={() => handleCatalogSelection(catalog)}
                onLongPress={() =>  navigation.navigate('Edit Catalog', 
                  { 
                    userId: userId,
                    catalog: catalog,
                    })
                }>
                  <Card.Cover source={{ uri: catalog.images && catalog.images.length > 0? catalog.images[0] : "https://via.placeholder.com/150" }} />
                  <Card.Title title={catalog.name}  titleStyle={{ fontFamily: 'System', fontSize: 18, fontWeight: 'bold', color: '#333' }}/>
                  <Card.Content>
                    <RNPText variant="labelMedium">
                      Description: {catalog.description}
                      Category: {catalog.category}
                    </RNPText>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  catalogsContainer: {
    width: "100%",
    height: "50%",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  card: {
    width: "48%", // For the vertical look, more cards are shown on screen
    marginVertical: 5,
    borderRadius: 15, //To give each card a more rounded look
  },
});