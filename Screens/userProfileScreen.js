import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Header from '../Components/header';
import Footer from '../Components/footer';

export default function UserProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Placeholder image URL, replace it with the actual URL of the user's profile picture
  const profilePictureUrl = 'https://via.placeholder.com/150';

  const handleSaveProfile = () => {
    // Handle saving the user's profile data
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} showBackButton={true} />
      <View style={styles.content}>
        <Image source={{ uri: profilePictureUrl }} style={styles.profilePicture} />
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Private Account</Text>
            <TouchableOpacity
              style={[styles.switchButton, isPrivate ? styles.switchButtonOn : null]}
              onPress={() => setIsPrivate(!isPrivate)}
            >
              <Text style={styles.switchButtonText}>{isPrivate ? 'ON' : 'OFF'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
            <Text style={styles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  form: {
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
  },
  switchButton: {
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  switchButtonOn: {
    backgroundColor: '#007bff',
  },
  switchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
