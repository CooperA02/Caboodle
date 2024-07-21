import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { updateCatalogName } from "../firebaseConfig";

export default function EditCatalogScreen({ route, navigation }) {
  const { catalog } = route.params;
  const [name, setName] = useState(catalog.name);

  const handleSubmit = async () => {
    try {
      await updateCatalogName(catalog.id, name);
      Alert.alert('Success', 'Catalog name updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update catalog name');
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
