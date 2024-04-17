import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Import icon components from Expo vector icons

export default function Header({ navigation, title }) {
  const handleGoBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  const handleGoToUserProfile = () => {
    navigation.navigate('UserProfile'); // Navigate to the UserProfileScreen
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>
      {/* Profile Icon */}
      <TouchableOpacity style={styles.profileButton} onPress={handleGoToUserProfile}>
        <AntDesign name="user" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 35,
    marginRight: 30,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
