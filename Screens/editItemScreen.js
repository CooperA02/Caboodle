import React, { useState } from 'react';
import { View, Image, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { updateItemName, updateItemImage, deleteItems, deletePublicItems } from "../firebaseConfig";
import { Platform } from 'react-native';
import * as ImagePicker from "expo-image-picker";

export default function EditItemScreen({ route, navigation }) {
  const { item, userId, catalogId, publicCatalogId } = route.params;
  const [name, setName] = useState(item.name);
  const [hasSelectedNewImage, setHasSelectedNewImage] = useState(false);
  const [imageUri, setImageUri] = useState(item.images && item.images.length > 0 ? item.images[0] : null);

  console.log("publicCatalogueId before submit button: ", publicCatalogId);

  const handleSubmit = async () => {
    console.log("publicCatalogueId: ", publicCatalogId);
    try {
      await updateItemName(userId, catalogId, publicCatalogId, item.id, item.publicId, name);
      Alert.alert('Success', 'Item updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update item');
    }

    if (hasSelectedNewImage) {
      console.log("URL before updateItemImage:", imageUri);
      console.log("Public Item ID:", item.publicId);
      console.log(userId, catalogId, publicCatalogId, item.id, item.publicId, imageUri);
      await updateItemImage(userId, catalogId, publicCatalogId, item.id, item.publicId, imageUri); 
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
      setImageUri(result.assets[0].uri);
      setHasSelectedNewImage(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItems(userId, catalogId, item.id);
      Alert.alert('Success', 'Item deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting Item:', error);
      Alert.alert('Error', 'Failed to delete Item', error.message);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage}>
        {imageUri && <Image source={{uri: imageUri}} style={{width: 400, height: 400}} />}
      </TouchableOpacity>
      <TextInput
        placeholder="Enter new item name"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 50 }}
      />
      <Button title="Update Item" onPress={handleSubmit} />
      <Button title="Delete Item" color="red" onPress={handleDelete} />
    </View>
  );
}
