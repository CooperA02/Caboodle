import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, Alert } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons'; 
import Header from '../Components/header'; 
import Footer from '../Components/footer'; 

const windowWidth = Dimensions.get('window').width;

export default function Catalogs({ navigation, route }) {
  const [catalogs, setCatalogs] = useState([
    { id: 1, name: 'Catalog 1' },
    { id: 2, name: 'Catalog 2' },
    { id: 3, name: 'Catalog 3' },
    { id: 4, name: 'Catalog 4' },
  ]);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  //Added to access the catalog, this shit is also temp for demo purposes
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Access the new catalog directly from the route params
      const newCatalog = route.params?.newCatalog;
      if (newCatalog) {
        setCatalogs([...catalogs, newCatalog]);
      }
    });

    return unsubscribe;
 }, [navigation, route, catalogs]);


  const handleCreateNewCatalog = () => {
    navigation.navigate('CreateCatalogScreen');
  };

  const handleCatalogSelection = (catalog) => {
    setSelectedCatalog(catalog);
  };

  const handleToggleFilterMenu = () => {
    setFilterMenuVisible(!filterMenuVisible);
  };

  const handleFilterCatalogs = () => {
    // Logic to filter catalogs
  };

  //Added this so when the user presses and holds on a catalog it will prompt the user to delete that catalog
  const handleLongPress = (catalog) => {
    Alert.alert(
      "Delete Catalog",
      "Are you sure you want to delete this catalog?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => handleDeleteCatalog(catalog) }
      ],
      { cancelable: false }
    );
 };

   const handleDeleteCatalog = (catalogToDelete) => {
    setCatalogs(catalogs.filter(catalog => catalog.id !== catalogToDelete.id));
  };


  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="Your Catalogs" />
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.createCatalogButton, { flex: 2 }]} onPress={handleCreateNewCatalog}>
            <Text style={styles.createCatalogButtonText}>Create New Catalog +</Text>
            <AntDesign name="pluscircleo" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, { flex: 1 }]} onPress={handleToggleFilterMenu}>
            <Entypo name="select-arrows" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {filterMenuVisible && (
          <View style={styles.filterMenu}>
            <TouchableOpacity style={styles.filterMenuItem} onPress={handleFilterCatalogs}>
              <Text style={styles.filterMenuItemText}>Sort by Name</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterMenuItem} onPress={handleFilterCatalogs}>
              <Text style={styles.filterMenuItemText}>Sort by Size</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterMenuItem} onPress={handleFilterCatalogs}>
              <Text style={styles.filterMenuItemText}>Sort by Time</Text>
            </TouchableOpacity>
          </View>
        )}
        <ScrollView style={styles.catalogsContainer}>
          <View style={styles.row}>
            {catalogs.map((catalog) => (
              <TouchableOpacity
                key={catalog.id}
                style={[styles.catalogItem, catalog === selectedCatalog ? styles.selectedCatalogItem : null]}
                onPress={() => handleCatalogSelection(catalog)}
                onLongPress={() => handleLongPress(catalog)} // Added onLongPress prop
              >
                <Image source={{uri: 'https://via.placeholder.com/150'}} style={styles.catalogImage} />
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  createCatalogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '48%',
  },
  createCatalogButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  filterButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  filterMenu: {
    backgroundColor: '#f0f0f0',
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
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  catalogItem: {
    width: '48%', // Set width to occupy half of the row
    aspectRatio: 1, // Maintain aspect ratio to create a square
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  selectedCatalogItem: {
    backgroundColor: '#ccc', // Change background color for selected catalog item
  },
  catalogImage: {
    width: '70%',
    height: '70%',
    marginBottom: 10,
  },
  catalogName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
