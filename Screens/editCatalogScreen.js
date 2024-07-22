import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { updateCatalogName } from "../firebaseConfig";

export default function EditCatalogScreen({ route, navigation }) {
  const { userId, catalog } = route.params;
  const [name, setName] = useState(catalog.name);

  const handleSubmit = async () => {
    try {

        await updateCatalogName(userId, catalog.id, catalog.publicId, name);
        Alert.alert('Success', 'Catalog updated successfully');
        navigation.goBack();
    } catch (error) {
        console.error('Error updating Catalog:', error);
        Alert.alert('Error', 'Failed to update Catalog', error.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter new catalog name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Update Catalog Name" onPress={handleSubmit} />
    </View>
  );
}
