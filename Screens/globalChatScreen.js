import React, { useState, useEffect, useContext, useRef } from "react";
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
import { fetchGlobalChat, addGlobalMessage, auth, firestore } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { PreferencesContext } from '../Components/preferencesContext';

export default function GlobalChatScreen() {
  const [globalMessages, setGlobalMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { isThemeDark } = useContext(PreferencesContext);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const globalChat = await fetchGlobalChat();
        const sortedChat = globalChat.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        setGlobalMessages(sortedChat);
      } catch (error) {
        console.error("Error fetching initial data:", error.message);
      }
    };

    fetchInitialData();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const profilePictureUrl = userDoc.exists() && userDoc.data().profilePictureUrl 
          ? userDoc.data().profilePictureUrl 
          : 'https://via.placeholder.com/40';

        await addGlobalMessage(user.displayName, newMessage, profilePictureUrl);
        setNewMessage("");
        Keyboard.dismiss();
        const updatedGlobalChat = await fetchGlobalChat();
        const sortedChat = updatedGlobalChat.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        setGlobalMessages(sortedChat);
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    }
  };

  const currentUserMessageBackground = isThemeDark ? 'green' : '#e1ffc7';

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={170}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}
        ref={scrollViewRef} // Attach the ref here
      >
        <View>
          <Text style={styles.sectionTitle}>Global Chat:</Text>
          {globalMessages.map((message) => {
            const isCurrentUser = auth.currentUser?.uid === message.userId;
            const otherUserMessageBackgroundColor = isThemeDark ? 'black' : '#f1f1f1';
            return (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
                ]}
              >
                {!isCurrentUser && <Avatar.Image size={40} source={{ uri: message.profilePictureUrl }} />}
                <View
                  style={[
                    styles.messageContent,
                    isCurrentUser ? { ...styles.currentUserMessageContent, backgroundColor: currentUserMessageBackground } : styles.otherUserMessageContent,
                    !isCurrentUser && { backgroundColor: otherUserMessageBackgroundColor },
                  ]}
                >
                  <Text style={[styles.messageSender, isThemeDark ? styles.darkModeTextColor : styles.lightModeTextColor]}>{message.messageSender}</Text>
                  <Text style={[styles.messageText, isThemeDark ? styles.darkModeTextColor : styles.lightModeTextColor]}>{message.messages}</Text>
                  <Text style={[styles.messageTime, isThemeDark ? styles.darkModeTextColor : styles.lightModeTextColor]}>{new Date(message.timestamp.seconds * 1000).toLocaleString()}</Text>
                </View>
                {isCurrentUser && <Avatar.Image size={40} source={{ uri: message.profilePictureUrl }} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
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