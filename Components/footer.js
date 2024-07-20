import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Footer() {
  const navigation = useNavigation();

  const handleNavigateToHome = () => {
    navigation.navigate('UserHomeScreen'); //Navigates to the home screen
  };

  const handleNavigateToUserProfile = () => {
    navigation.navigate("UserProfile"); // Navigate to the UserProfileScreen
  };

  const handleNavigateToCatalogs = () => {
    navigation.navigate("Catalogs"); // Navigate to the Catalogs screen
  };

  const handleNavigateToSearch = () => {
    navigation.navigate("SearchCatalogsScreen"); // Navigate to the SearchCatalogsScreen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateToHome}>
        <AntDesign name="home" size={24} color="black" />
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleNavigateToSearch}>
        <Feather name="search" size={24} color="black" />
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateToCatalogs}
      >
        <FontAwesome name="book" size={24} color="black" />
        <Text style={styles.buttonText}>Catalogs</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateToUserProfile}
      >
        <MaterialIcons name="settings" size={24} color="black" />
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#eee",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingTop: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});