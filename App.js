import React, { useState, useMemo, useCallback } from "react";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import ChatListScreen from "./Screens/chatListScreen";
import UserNewsFeed from "./Screens/userNewsFeed";
import ViewPublicCatalogScreen from "./Screens/viewPublicCatalogScreen";
import ViewPublicItemScreen from "./Screens/viewPublicItemScreen";
import EditAttributeScreen from "./Screens/editAttributeScreen";
import editCatalogScreen from "./Screens/editCatalogScreen";
import editItemScreen from "./Screens/editItemScreen";
import AccessibilityScreen from './Screens/accessibilityScreen';
import UserChatsScreen from "./Screens/userChatScreen";
import GlobalChatScreen from "./Screens/globalChatScreen";
import DirectChatsScreen from "./Screens/directChatScreen";
import {
  Provider as PaperProvider,
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import merge from 'deepmerge';
import { PreferencesContext } from './Components/preferencesContext';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});
const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

//Foundations
function MyTabs() {
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showMoreIcon, setShowMoreIcon] = useState(true);
  const [appbarMode, setAppbarMode] = useState("small"); //TODO: Include accessibility option to give users more choice over text size

  return (
    <>
      <Tab.Navigator //the brand new tab navigator
        activeColor="orange" //when navbar button is pressed
        inactiveColor="grey" //when navbar button is inactive
      >
        <Tab.Screen
          name="Search Catalogs"
          component={SearchCatalogsScreen}
          options={{
            headerShown: false, //Hack fix, but it works!
            tabBarLabel: "Search",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Newsfeed"
          component={UserNewsFeed}
          options={{
            headerShown: false,
            tabBarLabel: "Feed",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="newspaper-variant-outline"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Scan"
          component={CreateCatalogScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Post",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="camera-outline"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="My Catalogs"
          component={CatalogsScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Catalogs",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="book-open-blank-variant"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Chat List"
          component={ChatListScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Chat",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chat" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}


export default function App() {
  const [isThemeDark, setIsThemeDark] = React.useState(false);
  const [textSize, setTextSize] = useState('small');
  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const toggleTextSize = useCallback(() => {
    setTextSize(prevTextSize => 
      prevTextSize === 'small' ? 'medium' : prevTextSize === 'medium' ? 'large' : 'small'
    );
  }, []);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark, toggleTextSize, textSize]
  );
  return (
    <PreferencesContext.Provider value={preferences}>
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
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
            options={{ headerShown: true }} 
          />
          <Stack.Screen
            name="View Public Item"
            component={ViewPublicItemScreen}
            options={{ headerShown: true }} 
          />
          <Stack.Screen
            name="Accessibility"
            component={AccessibilityScreen}
            options={{ headerShown: true }} 
          />
                    <Stack.Screen
            name="UserChatScreen"
            component={UserChatsScreen}
            options={{ headerShown: true }} // Hide header
          />
          <Stack.Screen
            name="GlobalChat"
            component={GlobalChatScreen}
            options={{ headerShown: true }} // Hide header
          />
          <Stack.Screen
            name="DirectChat"
            component={DirectChatsScreen}
            options={{ headerShown: true }} // Hide header
          />
          <Stack.Screen
            name="Edit Attribute"
            component={EditAttributeScreen}
            options={{ headerShown: true }} // Hide header
          />
          <Stack.Screen
            name="Edit Catalog"
            component={editCatalogScreen}
            options={{ headerShown: true }} // Hide header
          />
          <Stack.Screen
            name="Edit Item"
            component={editItemScreen}
            options={{ headerShown: true }} // Hide header
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
    </PreferencesContext.Provider>
  );
}
