import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "./Screens/signUpScreen";
import UserProfileScreen from "./Screens/userProfileScreen";
import CatalogsScreen from "./Screens/userCatalogsScreen";
import CreateCatalogScreen from "./Screens/createCatalogScreen";
import ViewCatalogScreen from "./Screens/viewCatalogScreen";
import SearchCatalogsScreen from "./Screens/searchCatalogsScreen";
import UserHomeScreen from "./Screens/userHomeScreen";
import CreateItemScreen from "./Screens/createItemScreen";
import viewItemScreen from "./Screens/viewItemScreen";
import createAttributeScreen from "./Screens/createAttributeScreen";
<<<<<<< Updated upstream
=======
import ChatListScreen from "./Screens/chatListScreen";
import UserNewsFeed from "./Screens/userNewsFeed";
import ViewPublicCatalogScreen from "./Screens/viewPublicCatalogScreen";
import ViewPublicItemScreen from "./Screens/viewPublicItemScreen";
import editAttributeScreen from "./Screens/editAttributeScreen";
import {
  Provider as PaperProvider,
  BottomNavigation,
  Appbar,
  FAB,
  List,
  Paragraph,
  RadioButton,
  Snackbar,
  Switch,
  Text,
  useSafeAreaInsets,
  MD3DarkTheme,
  MD3LightTheme,
  MD2DarkTheme,
  MD2LightTheme,
  MD2Theme,
  MD3Theme,
  useTheme,
  adaptNavigationTheme,
  configureFonts,
} from "react-native-paper"; //Unused imports are still here as setup for other TODO items if there is time...
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
>>>>>>> Stashed changes

const Stack = createStackNavigator();

export default function App() {
  return (
<<<<<<< Updated upstream
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="UserHomeScreen" component={UserHomeScreen} />
        <Stack.Screen name="Catalogs" component={CatalogsScreen} />
        <Stack.Screen name="CreateCatalogScreen" component={CreateCatalogScreen}/>
        <Stack.Screen name="ViewCatalogScreen" component={ViewCatalogScreen} />
        <Stack.Screen name="SearchCatalogsScreen" component={SearchCatalogsScreen}/>
        <Stack.Screen name="CreateItemScreen" component={CreateItemScreen} />
        <Stack.Screen name="ViewItemScreen" component={viewItemScreen} />
        <Stack.Screen name="CreateAttributeScreen" component={createAttributeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
=======
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignUp"
          listeners={({ state }) => ({
            focus: (event) => {
              // If the focused route is the MainApp show the AppBar, if not hide the AppBar to prevent it showing on the login screen. A rare first attempt W.
              if (state.routes[state.index].name === "MainApp") {
                event.target.setHeaderVisible(true);
              } else {
                event.target.setHeaderVisible(false);
              }
            },
          })}
        >
          <Stack.Screen
            name="Create Attribute"
            component={createAttributeScreen}
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen
            name="Create Catalog"
            component={CreateCatalogScreen}
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen
            name="New Item"
            component={CreateItemScreen}
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }} // if it ain't broke... ctrl+c
          />
          <Stack.Screen
            name="User Home"
            component={UserHomeScreen}
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen
            name="Profile"
            component={UserProfileScreen}
            options={{ headerShown: true }} // Hide header
          />
          <Stack.Screen
            name="View Catalog"
            component={ViewCatalogScreen}
            options={{ headerShown: true }} // Hide header
          />
          <Stack.Screen
            name="View Item"
            component={viewItemScreen}
            options={{ headerShown: true }} // Hide header
          />
          <Stack.Screen
            name="MainApp"
            component={MyTabs}
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen
            name="View Public Catalog"
            component={ViewPublicCatalogScreen}
            options={{ headerShown: true }} // Hide header
          />
          <Stack.Screen
            name="View Public Item"
            component={ViewPublicItemScreen}
            options={{ headerShown: true }} // Hide header
          />
          <Stack.Screen
            name="Edit Attribute"
            component={editAttributeScreen}
            options={{ headerShown: true }} // Hide header
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
>>>>>>> Stashed changes
  );
}
