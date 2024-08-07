import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Avatar, Text, TextInput } from "react-native-paper";
import { auth, fetchMessages, addMessage } from "../firebaseConfig";
import { PreferencesContext } from '../Components/preferencesContext';

export default function UserChatScreen({ route }) {
  const { chatId, username } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const scrollViewRef = useRef(null);
  const { isThemeDark } = useContext(PreferencesContext);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const chatMessages = await fetchMessages(chatId);
        const sortedMessages = chatMessages.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchChatMessages();
  }, [chatId]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (messageText.trim() !== "") {
      try {
        await addMessage(chatId, messageText);
        setMessageText("");
        Keyboard.dismiss();
        const chatMessages = await fetchMessages(chatId);
        const sortedMessages = chatMessages.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    }
  };

  const currentUserMessageBackground = isThemeDark ? 'green' : '#e1ffc7';

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          {messages.map((item) => {
            const isCurrentUser = auth.currentUser?.uid === item.userId;
            const currentUserMessageBackground = isThemeDark ? 'green' : '#e1ffc7'; 
            const otherUserMessageBackgroundColor = isThemeDark ? 'black' : '#f1f1f1';
            return (
              <View
                key={item.id}
                style={[
                  styles.messageContainer,
                  isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
                  
                ]}
              >
                {!isCurrentUser && <Avatar.Image size={40} source={{ uri: item.profilePictureUrl }} />}
                <View
                  style={[
                    styles.messageContent,
                    isCurrentUser ? styles.currentUserMessageContent : styles.otherUserMessageContent,
                    isCurrentUser ? { ...styles.currentUserMessageContent, backgroundColor: currentUserMessageBackground } : styles.otherUserMessageContent,
                    !isCurrentUser && { backgroundColor: otherUserMessageBackgroundColor },
                  ]}
                >
                  <Text style={[styles.messageSender, , isThemeDark ? styles.darkModeTextColor : styles.lightModeTextColor]}>{item.sender}</Text>
                  <Text style={[styles.messageText, isThemeDark ? styles.darkModeTextColor : styles.lightModeTextColor]}>{item.text}</Text>
                  <Text style={[styles.messageTime, isThemeDark ? styles.darkModeTextColor : styles.lightModeTextColor]}>{new Date(item.timestamp.seconds * 1000).toLocaleString()}</Text>
                </View>
                {isCurrentUser && <Avatar.Image size={40} source={{ uri: item.profilePictureUrl }} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
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
    backgroundColor: "lightgreen",
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
    marginBottom: 35,
  },
  textInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 10,
  },
  darkModeTextColor: {
    color: 'white',
  },
  lightModeTextColor: {
    color: 'black',
  },
});