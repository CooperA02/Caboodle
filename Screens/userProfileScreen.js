import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { auth, fetchUserData, handleSaveProfile } from '../firebaseConfig'; // Import handleSaveProfile function
import Header from '../Components/header'; // Import Header component
import Footer from '../Components/footer'; // Import Footer component

export default function UserProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userId, setUserId] = useState(null); // State to store user ID
  const [isPrivate, setIsPrivate] = useState(false); // State for private account option
  const [profilePictureUrl, setProfilePictureUrl] = useState('https://via.placeholder.com/150'); // Placeholder image URL

  //Settings will go here as a button, take the user to a new page

  useEffect(() => {
    const getUserData = async () => {
      try {
        // Fetch user data from Firestore when component mounts
        const user = auth.currentUser;
        if (user) {
          setUserId(user.uid); // Set user ID if user is authenticated
          const userData = await fetchUserData(user.uid); // Pass user ID to fetchUserData function
          setUsername(userData.username);
          setPhoneNumber(userData.phoneNumber);
          // Update profile picture URL if available in user data
          if (userData.profilePictureUrl) {
            setProfilePictureUrl(userData.profilePictureUrl);
          }
          // Update isPrivate state if available in user data
          if (userData.isPrivate !== undefined) {
            setIsPrivate(userData.isPrivate);
          }
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    getUserData();

    // Cleanup function
    return () => {
      // Any cleanup logic here
    };
  }, []); // useEffect will run only once when the component mounts
  
  const handleProfileSave = () => {
    handleSaveProfile(userId, username, phoneNumber, profilePictureUrl, isPrivate); // Call the handleSaveProfile function with profile picture URL and private account option
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header navigation={navigation} title="Profile" />
      <View style={styles.content}>
        {/* Profile Picture */}
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
          {/* Private Account Option */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Private Account</Text>
            <TouchableOpacity
              style={[styles.switchButton, isPrivate ? styles.switchButtonOn : null]}
              onPress={() => setIsPrivate(!isPrivate)}
            >
              <Text style={styles.switchButtonText}>{isPrivate ? 'ON' : 'OFF'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleProfileSave}>
            <Text style={styles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Footer */}
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
  form: {
    width: '75%',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
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
