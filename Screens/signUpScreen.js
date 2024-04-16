import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebaseConfig'; // Import the Firebase auth object and authentication functions
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = () => {
    signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('Signed in:', user);
        navigation.navigate('UserProfile'); // Navigate to UserProfileScreen upon successful sign in
      })
      .catch((error) => {
        console.error('Error signing in:', error);
        setError(error.message);
      });
  };

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log('Signed up:', user);
        navigation.navigate('UserProfile'); // Navigate to UserProfileScreen upon successful sign up
      })
      .catch((error) => {
        console.error('Error signing up:', error);
        setError(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.caboodleText}>Caboodle</Text>
        <Text style={styles.collectionCatalogsText}>Collection Catalogs</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoCompleteType="password"
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
        {/* Display error message if there is an error */}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caboodleText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  collectionCatalogsText: {
    fontSize: 24,
    color: '#555',
  },
  form: {
    flex: 1,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%', 
    height: '50%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 10,
    alignSelf: 'center',
  },
});
