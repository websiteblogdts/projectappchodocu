import React, { useState, useEffect } from 'react';
import { View, Text,TextInput, FlatList, ActivityIndicator, RefreshControl, StyleSheet, Image,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';
import SenderMessageStyles from "../../components/SenderMessageStyles"
import ReceiverMessageStyles from '../../components/ReceiverMessageStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';

const socket = io(config.socketServerURL); // Connect to Socket.IO server

const MessagesScreen = ({ route }) => {
  const { chatId } = route.params;
  console.log("Received chatId:", chatId); // Log received chatId
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage'); // Clean up listener when component unmounts
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/mess/messages/${chatId}`, {
        headers: {
          'Authorization': `${userToken}` // Thêm Bearer vào trước token
        }
      });
      const data = await response.json();
      console.log('Fetched Messages:', data); // Log fetched messages
      setMessages(data.messages); // Assuming data has a messages property which is an array of messages
      setCurrentUserId(data.currentUserId); // Assuming data has a currentUserId property
      
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Đảm bảo refreshing được cập nhật
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    } else {
      console.error('chatId is undefined');
      setLoading(false);
    }
  }, [chatId]);

  const sendMessage = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/mess/sendmess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${userToken}`
        },
        body: JSON.stringify({
          chatId: chatId,
          senderId: currentUserId,
          content: messageInput
        })
      });
      const data = await response.json();
      console.log('Sent message:', data); // Log sent message
      // Fetch messages again after sending the message
      fetchMessages();
      // Clear message input after sending
      setMessageInput('');
    socket.emit('sendMessage', { chatId, senderId: currentUserId, content: messageInput });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#414141" />;
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  const renderMessage = ({ item }) => {
    const isSender = item.sender._id === currentUserId;
    const styles = isSender ? SenderMessageStyles : ReceiverMessageStyles;

    return (
      <View style={styles.messageContainer}>
        <View style={styles.userContainer}>
          <Image source={{ uri: item.sender.avatar_image }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.username}>{item.sender.name}</Text>
            
            <Text style={styles.content}>{item.content}</Text>
          </View>
        </View>
      </View>
    );
  };

   return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Nhập tin nhắn..."
        />
        {/* <Ionicons name="send" style={styles.sendButton} onPress={sendMessage}
        /> */}
         <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={30} color="gray" style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#414141',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#009387',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MessagesScreen;
