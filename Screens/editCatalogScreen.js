import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Button, Alert, Image } from 'react-native';
import { updateCatalogName, updateCatalogImage, deleteCatalogs  } from "../firebaseConfig";
import { Platform } from 'react-native';
import * as ImagePicker from "expo-image-picker";

export default function EditCatalogScreen({ route, navigation }) {
  const { userId, catalog } = route.params;
  const [name, setName] = useState(catalog.name);
  const [imageUri, setImageUri] = useState(catalog.images && catalog.images.length > 0 ? catalog.images[0] : null);
  const [hasSelectedNewImage, setHasSelectedNewImage] = useState(false);

  const handleSubmit = async () => {
    console.log("URL at begining of submit:", imageUri);
    try {
      await updateCatalogName(userId, catalog.id, catalog.publicId, name);

      if (hasSelectedNewImage) {
        console.log("URL before updateCatalogImage:", imageUri);
        await updateCatalogImage(userId, catalog.id, catalog.publicId, imageUri); // Update image in Firebase
      }

      Alert.alert('Success', 'Catalog updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating Catalog:', error);
      Alert.alert('Error', 'Failed to update Catalog', error.message);
    }
  };
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri; // Correctly access the URI
      setImageUri(selectedImageUri);
      setHasSelectedNewImage(true);
      console.log("Selected image URI:", selectedImageUri); // Log the correct URI
    } else {
      console.log('User cancelled image picker or no image selected');
    }
  };
  
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteCatalogs(userId, catalog.id, catalog.publicId);
      Alert.alert('Success', 'Catalog deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting Catalog:', error);
      Alert.alert('Error', 'Failed to delete Catalog', error.message);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage}>
        {imageUri && <Image source={{uri: imageUri}} style={{width: 400, height: 400}} />}
      </TouchableOpacity>
      <TextInput
        placeholder="Enter new catalog name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Update Catalog" onPress={handleSubmit} />
      <Button title="Delete Catalog" color="red" onPress={handleDelete} />
    </View>
  );
}

