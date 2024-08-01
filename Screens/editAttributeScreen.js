import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateAttribute, updateItemDescription, updateItemValue } from "../firebaseConfig";

export default function EditAttributeScreen({ route, navigation }) {
    const { attribute, userId, catalogId, itemId, pubCatalogId, pubItemId, isValue, isDescription } = route.params;
    console.log(route.params);

    const [name, setName] = useState(attribute ? attribute.name : '');
    const [value, setValue] = useState(attribute ? attribute.value : '');

    useEffect(() => {
        if (attribute) {
            setName(attribute.name);
            setValue(attribute.value);
        }
    }, [attribute]);

    const handleSubmit = async () => {
        if (!value) {
            Alert.alert('Error', 'Value cannot be empty');
            return;
        }
    
        if (!attribute.id || (!isValue && !isDescription && !attribute.publicId)) {
            Alert.alert('Error', 'Invalid attribute ID');
            return;
        }
    
        try {
            console.log("Submitting attribute with value:", value);
            if (isValue) {
                await updateItemValue(userId, catalogId, pubCatalogId, itemId, pubItemId, attribute.id, value);
            } else if (isDescription) {
                await updateItemDescription(userId, catalogId, pubCatalogId, itemId, pubItemId, value);
            } else {
                await updateAttribute(userId, catalogId, pubCatalogId, itemId, pubItemId, attribute.id, attribute.publicId, name, value);
            }
            Alert.alert('Success', 'Attribute updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating attribute:', error);
            Alert.alert('Error', `Failed to update attribute: ${error.message}`);
        }
    };    

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                editable={!isValue && !isDescription} // Disable name editing for Value and Description
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
