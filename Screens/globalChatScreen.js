import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Avatar } from "react-native-paper";
import { fetchGlobalChat, addGlobalMessage, auth } from "../firebaseConfig";

export default function GlobalChatScreen() {
  const [globalMessages, setGlobalMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const globalChat = await fetchGlobalChat();
      setGlobalMessages(globalChat);
    };

    fetchInitialData();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }
    const user = auth.currentUser;
    if (user) {
      await addGlobalMessage(user.displayName, newMessage, user.photoURL);
      setNewMessage("");
      const updatedGlobalChat = await fetchGlobalChat();
      setGlobalMessages(updatedGlobalChat);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <Text style={styles.sectionTitle}>Global Chat:</Text>
          {globalMessages.map((message) => {
            const isCurrentUser = auth.currentUser?.uid === message.userId;
            return (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
                ]}
              >
                {!isCurrentUser && <Avatar.Image size={40} source={{ uri: message.photoURL }} />}
                <View style={[styles.messageContent, isCurrentUser ? styles.currentUserMessageContent : styles.otherUserMessageContent]}>
                  <Text style={styles.messageSender}>{message.messageSender}</Text>
                  <Text style={styles.messageText}>{message.messages}</Text>
                  <Text style={styles.messageTime}>{new Date(message.timestamp.seconds * 1000).toLocaleString()}</Text>
                </View>
                {isCurrentUser && <Avatar.Image size={40} source={{ uri: message.photoURL }} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  messageContent: {
    marginLeft: 10,
    marginRight: 10,
    maxWidth: "70%",
  },
  messageSender: {
    fontWeight: "normal",
  },
  messageText: {
    fontWeight: "bold",
  },
  messageTime: {
    fontStyle: "italic",
    fontSize: 12,
  },
  currentUserMessage: {
    flexDirection: "row-reverse",
    alignSelf: "flex-end",
  },
  currentUserMessageContent: {
    alignItems: "flex-end",
    backgroundColor: "#e1ffc7",
    borderRadius: 10,
    padding: 10,
  },
  otherUserMessage: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  otherUserMessageContent: {
    alignItems: "flex-start",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});
