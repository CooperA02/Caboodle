import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Appbar, Button } from 'react-native-paper';
import { auth, searchUsers, fetchChats, fetchGlobalChat } from "../firebaseConfig";

const Tab = createMaterialTopTabNavigator();

export default function ChatListScreen({ navigation, route }) {
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Chat" />
        <Appbar.Action icon="account-outline" onPress={() => navigation.navigate('Profile')} />
      </Appbar.Header>
      <Tab.Navigator
        initialRouteName="Chat"
        screenOptions={{
          tabBarActiveTintColor: 'blue',
          tabBarLabelStyle: { fontSize: 16, textTransform: 'none' },
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

function ChatScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const results = await searchUsers(searchQuery.trim());
    setSearchResults(results);
  };

  const handleChatWithUser = (user) => {
    // Logic to initiate chat with the selected user
  };

  return (
    <View style={styles.screenContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button onPress={handleSearch}>Search</Button>
      <ScrollView>
        <View>
          <Text style={styles.sectionTitle}>Search Results:</Text>
          {searchResults.map((user) => (
            <TouchableOpacity key={user.id} onPress={() => handleChatWithUser(user)}>
              <Text>{user.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("UserChats")}>
            <Text style={styles.linkText}>Your Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("GlobalChat")}>
            <Text style={styles.linkText}>Global Chat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  linkText: {
    fontSize: 18,
    color: "blue",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
