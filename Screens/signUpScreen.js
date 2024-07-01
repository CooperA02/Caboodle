import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
        navigation.navigate('MainApp', { screen: 'Search Catalogs' }); //Navigates to Search upon successful sign in
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
        navigation.navigate('MainApp', { screen: 'Profile' }); // Navigates to UserProfileScreen upon successful sign up
      })
      .catch((error) => {
        console.error('Error signing up:', error);
        setError(error.message);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
      <View style={styles.header}>
      <Image
          source={require('../assets/logo-png.png')} 
          style={styles.logo}
        />
      </View>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
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
        </View>
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute', 
    top: 80, // Lowered from 120 to move the logo higher up
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  /*caboodleText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  collectionCatalogsText: {
    fontSize: 24,
    color: '#555',
  },*/
  form: {
    marginTop: 150, 
    width: '100%',
  },
  inputContainer: {
    marginTop: 150, 
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
    height: 40, // Fixed height for buttons
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
  logo: {
    width: 250,
    height: 200,
    marginBottom: 10,
  },
});
