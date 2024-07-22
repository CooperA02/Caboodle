import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { auth, fetchUserData, handleSaveProfile, uploadProfilePicture } from '../firebaseConfig'; // Import handleSaveProfile function
import { useTheme, Appbar, TouchableRipple, Switch, TextInput, Text} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { PreferencesContext } from '../Components/preferencesContext';

export default function UserProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userId, setUserId] = useState(null); // State to store user ID
  const [isPrivate, setIsPrivate] = useState(false); // State for private account option
  const [profilePictureUrl, setProfilePictureUrl] = useState('https://via.placeholder.com/150'); // Placeholder image URL
  const { isThemeDark, toggleTheme } = useContext(PreferencesContext);

  //TODO -- Settings will go here as a button, take the user to a drawer with accessibility options

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
    };
  }, []); // useEffect will run only once when the component mounts
  
  const handleProfileSave = async () => {
    try {
      await handleSaveProfile(userId, username, phoneNumber, profilePictureUrl, isPrivate); // Save profile data
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error.message);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const handleProfilePictureChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log('Image Picker Result:', result);
    console.log('User ID:', userId);

    if (!result.canceled) {
      const { uri } = result.assets[0]; // Get the URI from the result

      // Check that URI and user ID are both defined
      if (uri && userId) {
        try {
          const uploadResult = await uploadProfilePicture(uri, userId);
          console.log('Upload Result:', uploadResult);
          setProfilePictureUrl(uploadResult.url);
        } catch (error) {
          console.error('Error uploading profile picture:', error.message);
          Alert.alert('Error', 'Failed to upload profile picture. Please try again.');
        }
      } else {
        console.error('User ID or image URI is missing.');
        Alert.alert('Error', 'User ID or image URI is missing.');
      }    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Profile Picture */}
        <TouchableOpacity onPress={handleProfilePictureChange}>
          <Image source={{ uri: profilePictureUrl }} style={styles.profilePicture} />
        </TouchableOpacity>
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
          <Text style={styles.switchLabel}>Dark Mode</Text>
          <Switch
            color={'lightblue'}
            value={isThemeDark}
            onValueChange={toggleTheme}
          />
          </View>
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
          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]} // Adjust styling as needed
            onPress={() => navigation.navigate('Accessibility')}>
          <Text style={styles.buttonText}>Accessibility</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]} // Adjust styling as needed
            onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
        </View>
      </View>

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