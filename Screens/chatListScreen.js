import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Appbar, Button, Card } from 'react-native-paper';
import { auth, searchUsers, createChat, fetchChats } from "../firebaseConfig";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const Tab = createMaterialTopTabNavigator();

export default function ChatListScreen({ navigation }) {
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

  const handleChatWithUser = async (user) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("User not authenticated");
      return;
    }
  
    const chats = await fetchChats(currentUser.uid);
    let existingChat = null;
  
    for (const chat of chats) {
      if ((chat.user1Id === currentUser.uid && chat.user2Id === user.id) ||
          (chat.user1Id === user.id && chat.user2Id === currentUser.uid)) {
        existingChat = chat;
        break;
      }
    }
  
    let chatId;
    if (existingChat) {
      chatId = existingChat.chatId;
    } else {
      chatId = await createChat(currentUser.uid, user.id, currentUser.displayName, user.username);
    }
  
    navigation.navigate("UserChatScreen", {
      chatId: chatId,
      username: user.username,
    });
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
            <Card key={user.id} style={styles.userCard} onPress={() => handleChatWithUser(user)}>
              <View style={styles.cardContent}>
                <Image source={{ uri: user.profilePictureUrl }} style={styles.userImage} />
                <Text style={styles.username}>{user.username}</Text>
              </View>
            </Card>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("DirectChat")} style={styles.iconButton}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="message" size={50} color="black" />
              <Text style={styles.iconText}>Direct Chat</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("GlobalChat")} style={styles.iconButton}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="earth" size={50} color="black" />
              <Text style={styles.iconText}>Global Chat</Text>
            </View>
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
  userCard: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
  },
});