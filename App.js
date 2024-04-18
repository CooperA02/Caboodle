// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './Screens/signUpScreen'; // Import the SignUpScreen component
import UserProfileScreen from './Screens/userProfileScreen'; // Import the UserProfileScreen component
import CatalogsScreen from './Screens/userCatalogsScreen';
import CreateCatalogScreen from './Screens/createCatalogScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
<Stack.Navigator
  screenOptions={{
    headerShown: false // Hide default header for all screens in the navigator
  }}
>
  <Stack.Screen name="SignUp" component={SignUpScreen} />
  <Stack.Screen name="UserProfile" component={UserProfileScreen} />
  <Stack.Screen name="Catalogs" component={CatalogsScreen} />
  <Stack.Screen name="CreateCatalogScreen" component={CreateCatalogScreen} />
</Stack.Navigator>

    </NavigationContainer>
  );
}
