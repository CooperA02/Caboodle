import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateAttribute } from "../firebaseConfig";


export default function EditAttributeScreen({ route, navigation }) {
    const { attribute, userId, catalogId, itemId, pubCatalogId, pubItemId } = route.params;
    console.log(route.params);
    console.log("EditAttributes Function Check: ", typeof userId, typeof catalogId, typeof pubCatalogId, typeof itemId, typeof pubItemId, typeof attribute.id, typeof name, typeof  value);


    const [name, setName] = useState(attribute ? attribute.name : '');
    const [value, setValue] = useState(attribute ? attribute.value : '');

    useEffect(() => {
        if (attribute) {
            setName(attribute.name);
            setValue(attribute.value);
        }
    }, [attribute]);

    const handleSubmit = async () => {
        console.log(userId, catalogId, pubCatalogId, itemId, pubItemId, attribute.id, attribute.publicId, name, value);
        console.log("just problem ones ID: " , typeof attribute.publicId);
        console.log("inside handle submit: " , typeof userId, typeof catalogId, typeof pubCatalogId, typeof itemId, typeof pubItemId, typeof attribute.id, typeof attribute.publicId, typeof name, typeof  value);        
        if (!attribute.publicId) {
            attribute.publicId = null;
        }
        if (!pubItemId) {
            pubItemId = null;
        }
        if (!pubCatalogId) {
            pubCatalogId = null;
        }
        try {
            await updateAttribute(userId, catalogId, pubCatalogId, itemId, pubItemId, attribute.id, attribute.publicId, name, value);
            Alert.alert('Success', 'Attribute updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating attribute:', error);
            Alert.alert('Error', 'Failed to update attribute', error);
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