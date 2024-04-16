import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Import icon components from Expo vector icons

export default function Footer() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <AntDesign name="home" size={24} color="black" />
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Feather name="search" size={24} color="black" />
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <FontAwesome name="book" size={24} color="black" />
        <Text style={styles.buttonText}>Catalogs</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <MaterialIcons name="settings" size={24} color="black" />
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#eee',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingTop: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
