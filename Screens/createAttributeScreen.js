import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Header from "../Components/header";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, createAttribute } from "../firebaseConfig";

export default function CreateAttributeScreen({ navigation, route }) {
  const { selectedCatalog } = route.params;
  const { selectedItem } = route.params;
  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");

  const handleCreateAttribute = async () => {
    const newAttribute = {
      name: attributeName,
      value: attributeValue,
    };

    try {
      createAttribute(
        auth.currentUser.uid,
        selectedCatalog.id,
        selectedItem.id,
        newAttribute
      );
      navigation.navigate("ViewItemScreen", {
        selectedCatalog: selectedCatalog,
        selectedItem: selectedItem,
      });
    } catch (e) {
      console.error("Error saving catalog data: ", e);
    }
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="Create New Attribute" />
      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Name of Attribute"
            value={attributeName}
            onChangeText={setAttributeName}
            style={styles.input}
          />
          <TextInput
            placeholder="Value of Attribute"
            value={attributeValue}
            onChangeText={setAttributeValue}
            style={styles.input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateAttribute}
          >
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  createButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
