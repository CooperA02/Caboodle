import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { auth, fetchChats } from "../firebaseConfig";

export default function UserChatsScreen({ navigation }) {
  const [userChats, setUserChats] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const user = auth.currentUser;
      if (user) {
        const chats = await fetchChats(user.uid);
        setUserChats(chats);
      }
    };

    fetchInitialData();
  }, []);

  const handleNavigateToChat = (chat) => {
    // Logic to navigate to the chat screen with the selected chat
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView>
        <View>
          <Text style={styles.sectionTitle}>Your Chats:</Text>
          {userChats.map((chat) => (
            <TouchableOpacity key={chat.id} onPress={() => handleNavigateToChat(chat)}>
              <Text>{chat.name1 === auth.currentUser.uid ? chat.name2 : chat.name1}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});
