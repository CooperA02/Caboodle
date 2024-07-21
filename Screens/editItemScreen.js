import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { updateItemName } from "../firebaseConfig";

export default function EditItemScreen({ route, navigation }) {
  const { item } = route.params;
  const [name, setName] = useState(item.name);

  const handleSubmit = async () => {
    try {
      await updateItemName(item.id, name);
      Alert.alert('Success', 'Item name updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update item name');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter new item name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Update Item Name" onPress={handleSubmit} />
    </View>
  );
}
