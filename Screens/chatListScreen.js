import React from "react";
import { View } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Appbar, Avatar, Button, IconButton, Paragraph, Text as RNPText, Text } from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

export default function ChatListScreen({ navigation, route }) {
  return (
    <>
    <Appbar.Header>
      <Appbar.Content title="Chat"/>
        <Appbar.Action icon="account-outline" onPress={() => navigation.navigate('Profile')} />
    </Appbar.Header>
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={{
        tabBarLabelStyle: { fontSize: 16, textTransform: 'none'  },
        
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarLabel: 'Chat' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarLabel: 'Notifications' }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{ tabBarLabel: 'Contacts' }}
      />
    </Tab.Navigator>
    </>
  );
}

function ChatScreen() {
  // ChatScreen logic will be implemented here
  return (
    <View style={styles.screenContainer}>
      <Text>Your Chats with other Collectors will be listed here!</Text>
    </View>
  );
}

//In progress... Thoughts?
function NotificationsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Any Notifications will be listed here!</Text>
    </View>
  );
}

//I added this as an option if there's time to implement "contact list" feature
function ContactsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Your saved contacts will be listed here!</Text>
    </View>
  );
}

const styles = {
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
