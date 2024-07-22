import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Avatar } from "react-native-paper";
import {
  auth,
  firestore,
  doc,
  getDoc,
  fetchChats,
  fetchLastMessage,
} from "../firebaseConfig";

export default function DirectChatsScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserChats = async () => {
      try {
        if (currentUser) {
          const userChats = await fetchChats(currentUser.uid);
          setChats(userChats);

          // Fetch user details for each chat
          const userIds = userChats.map(chat =>
            chat.user1Id === currentUser.uid ? chat.user2Id : chat.user1Id
          );
          const uniqueUserIds = [...new Set(userIds)]; 

          const userPromises = uniqueUserIds.map(async userId => {
            const userDocRef = doc(firestore, "users", userId);
            const userDoc = await getDoc(userDocRef);
            return { userId, data: userDoc.exists() ? userDoc.data() : {} };
          });

          const usersData = await Promise.all(userPromises);
          const usersMap = usersData.reduce((acc, { userId, data }) => {
            acc[userId] = data;
            return acc;
          }, {});

          setUsers(usersMap);

          // Fetch last message for each chat
          const lastMessagePromises = userChats.map(async chat => {
            const lastMessage = await fetchLastMessage(chat.id);
            return { chatId: chat.id, ...lastMessage };
          });

          const lastMessagesData = await Promise.all(lastMessagePromises);
          const lastMessagesMap = lastMessagesData.reduce((acc, { chatId, text, timestamp }) => {
            acc[chatId] = { text, timestamp };
            return acc;
          }, {});

          setLastMessages(lastMessagesMap);
        }
      } catch (error) {
        console.error("Error fetching user chats:", error.message);
      }
    };

    fetchUserChats();
  }, [currentUser]);

  const handlePress = (chatId, otherUserName) => {
    navigation.navigate("UserChatScreen", { chatId, username: otherUserName });
  };

  const renderItem = ({ item }) => {
    const otherUserId = item.user1Id === currentUser.uid ? item.user2Id : item.user1Id;
    const otherUser = users[otherUserId] || {};
    const otherUserName = item.user1Id === currentUser.uid ? item.name2 : item.name1;
    const profilePictureUrl = otherUser.profilePictureUrl || 'https://via.placeholder.com/40'; 
    const lastMessage = lastMessages[item.id] || { text: "No messages yet", timestamp: null };

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      let hours = date.getHours();
      const minutes = date.getMinutes();
      
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours || 12;

      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      
      return `${hours}:${formattedMinutes} ${period}`;
    };      

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePress(item.id, otherUserName)}
      >
        <View style={styles.cardContent}>
          <Avatar.Image
            size={40}
            source={{ uri: profilePictureUrl }}
          />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{otherUserName || 'Unknown'}</Text>
            <Text style={styles.cardSubtitle}>
              {lastMessage.text} {lastMessage.timestamp ? `- Last message: ${formatTimestamp(lastMessage.timestamp)}` : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No chats available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    marginLeft: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  cardSubtitle: {
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});