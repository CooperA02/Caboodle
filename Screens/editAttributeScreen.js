import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateAttribute } from '../firebaseConfig';

export default function EditAttributeScreen({ route, navigation }) {

    const { attribute } = route.params;
    if (attribute) {
        // Now it's safe to use attribute
        console.log(attribute.name);
      } else {
        // Handle the case where attribute is undefined
        console.log("No attribute found");
      }
      
  const [name, setName] = useState(attribute.name);
  const [value, setValue] = useState(attribute.value);

  useEffect(() => {
    setName(attribute.name);
    setValue(attribute.value);
  }, [attribute]);

  const handleSubmit = async () => {
    console.log("Attribute for handle submit:", attribute);
    try {
      await updateAttribute(attribute.id, name, value);
      Alert.alert('Success', 'Attribute updated successfully');
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      Alert.alert('Error', 'Failed to update attribute');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Value"
        value={value}
        onChangeText={setValue}
      />
      <Button title="Update Attribute" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});