import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './Screens/signUpScreen';
import UserProfileScreen from './Screens/userProfileScreen';
import CatalogsScreen from './Screens/userCatalogsScreen';
import CreateCatalogScreen from './Screens/createCatalogScreen';
import ViewCatalogScreen from './Screens/viewCatalogScreen';
import SearchCatalogsScreen from './Screens/searchCatalogsScreen';
import UserHomeScreen from './Screens/userHomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="UserHomeScreen" component={UserHomeScreen} />
        <Stack.Screen name="Catalogs" component={CatalogsScreen} />
        <Stack.Screen name="CreateCatalogScreen" component={CreateCatalogScreen} />
        <Stack.Screen name="ViewCatalogScreen" component={ViewCatalogScreen} />
        <Stack.Screen name="SearchCatalogsScreen" component={SearchCatalogsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
