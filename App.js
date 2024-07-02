import React, { useState } from "react";
import { NavigationContainer, useRoute, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
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
import { Provider as PaperProvider, 
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
  configureFonts, } from 'react-native-paper'; //Unused imports are still here as setup for other TODO items if there is time...
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';



const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

//Foundations
function MyTabs() {
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showMoreIcon, setShowMoreIcon] = useState(true);
  const [appbarMode, setAppbarMode] = useState('small'); //TODO: Include accessibility option to give users more choice over text size

  return (
    <>
      <Tab.Navigator //the brand new tab navigator
        activeColor="orange" //when navbar button is pressed 
        inactiveColor="grey" //when navbar button is inactive
        barStyle={{ backgroundColor: 'white' }} //TODO: Integrate React Nav theming.  this can basically be changed to any color, however with integration of React Nav theming I can have way more subtle shading options for users to choose.
      >
        <Tab.Screen 
          name="Search Catalogs" 
          component={SearchCatalogsScreen} 
          options={{
            headerShown: false, //Hack fix, but it works!
            tabBarLabel: 'Search',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={26} /> //Unlike Bottomtab, MaterialTab makes icons smaller by default, adjusted size accordingly
            ),
          }}
        />
        <Tab.Screen 
          name="Newsfeed" 
          component={UserNewsFeed}
          options={{
            headerShown: false, 
            tabBarLabel: 'Feed',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="newspaper-variant-outline" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen 
          name="Scan" 
          component={CreateCatalogScreen} 
          options={{
            headerShown: false, 
            tabBarLabel: 'Post',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="camera-outline" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen 
          name="My Catalogs" 
          component={CatalogsScreen} 
          options={{
            headerShown: false, 
            tabBarLabel: 'Catalogs',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="book-open-blank-variant" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen 
          name="Chat List" 
          component={ChatListScreen}
          options={{
            headerShown: false, 
            tabBarLabel: 'Chat',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chat" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

//TODO -- figure out why, unlike android, iPhone status icons show for a few minutes, sometimes vanish for 5-10 minutes then reappear during same session but not every session.
//No chatgpt, no phind, no AI, cooking
export default function App() {
  return (
  <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp" listeners={({ state }) => ({
        focus: (event) => {
          // If the focused route is the MainApp show the AppBar, if not hide the AppBar to prevent it showing on the login screen. A rare first attempt W.  
          if (state.routes[state.index].name === 'MainApp') {
            event.target.setHeaderVisible(true);
          } else {
            event.target.setHeaderVisible(false);
          }
        },
      })}>
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
      </Stack.Navigator>
    </NavigationContainer>
  </PaperProvider>
  );
}
