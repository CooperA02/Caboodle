import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateAttribute } from "../firebaseConfig";
import { testFunction } from "../firebaseConfig";

console.log(testFunction); // Add this li

testFunction(); // Call the test function to see if it logs correctly

console.log(updateAttribute); // Add this line

export default function EditAttributeScreen({ route, navigation }) {
    const { attribute, userId, catalogId, itemId } = route.params;
    console.log(updateAttribute); // Add this line
    console.log(testFunction); // Add this li

testFunction(); // Call the test function to see if it logs correctly

    // Initialize state conditionally based on the existence of attribute
    const [name, setName] = useState(attribute ? attribute.name : '');
    const [value, setValue] = useState(attribute ? attribute.value : '');

    useEffect(() => {
        if (attribute) {
            setName(attribute.name);
            setValue(attribute.value);
        }
    }, [attribute]);

    const handleSubmit = async () => {
        try {
            testFunction();
            // Ensure attributeId is passed correctly
            await updateAttribute(userId, catalogId, itemId, attribute.id, name, value);
            console.log('Attribute updated:', userId, catalogId, itemId, attribute.id, name, value);
            Alert.alert('Success', 'Attribute updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating attribute:', error);
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