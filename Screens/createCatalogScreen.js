import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons'; 
import Header from '../Components/header'; 
import Footer from '../Components/footer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateCatalogScreen({ navigation }) {
    const [catalogName, setCatalogName] = useState('');
    const [catalogCategory, setCatalogCategory] = useState('');
    const [catalogDescription, setCatalogDescription] = useState('');

    const handleCreateCatalog = async () => {
      const timestamp = new Date().getTime();
      const catalogKey = `${catalogName}-${timestamp}`;
      
      // Prepare the catalog data
      const newCatalog = {
         id: catalogKey, // Use the unique key as the ID
         name: catalogName,
         category: catalogCategory,
         description: catalogDescription,
      };
      
      // Store the catalog data with AsyncStorage /temp for demo, will need to be replaced with firebase
      try {
        await AsyncStorage.setItem(catalogKey, JSON.stringify(newCatalog));
        // Navigate back or to another screen
        navigation.navigate('Catalogs', {
           newCatalog: newCatalog,
        });
      } catch (e) {
        console.error("Error saving catalog data: ", e);
      }
    };

    return (
      <View style={styles.container}>
        <Header navigation={navigation} title="Create New Catalog" />
        <ScrollView style={styles.content}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.addPhotoButton} onPress={() => {}}>
              <View style={{alignItems: 'center' }}>
                <Text style={{ marginRight: 10, marginBottom: 15 }}>Add Item Photos</Text>
                <AntDesign name="pluscircleo" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Name Your Catalog"
            value={catalogName}
            onChangeText={setCatalogName}
            style={[styles.input, { marginTop: 100 }]} 
          />
          <TextInput
            placeholder="Category"
            value={catalogCategory}
            onChangeText={setCatalogCategory}
            style={styles.input}
          />
          <TextInput
            placeholder="Describe The Catalog"
            value={catalogDescription}
            onChangeText={setCatalogDescription}
            multiline={true}
            style={styles.descriptionInput}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateCatalog}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingHorizontal: 20,
 },
 buttonWrapper: {
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%', 
 },
 addPhotoButton: {
    width: '48%', 
    aspectRatio: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c7c4bf',
    marginVertical: 5, 
    marginTop: 40, 
    borderRadius: 10,
    padding: 10,
 },
 input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
 },
 descriptionInput: {
    height: 160, // Increase the height for the description field
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
 },
 buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
 },
 cancelButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '45%',
 },
 createButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '45%',
 },
 buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
 },
});
