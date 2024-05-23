import React, { useState, useEffect, useRef } from 'react';
import { View, Text,TextInput, FlatList, ActivityIndicator, RefreshControl, StyleSheet, Image,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';
import socket  from '../../config/socket';
import SenderMessageStyles from "../../components/SenderMessageStyles"
import ReceiverMessageStyles from '../../components/ReceiverMessageStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';


const MessagesScreen = ({ route }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const flatListRef = useRef();

  useEffect(() => {
    fetchMessages();
  }, []);
  useEffect(() => {
    markMessagesAsRead(chatId);
}, []);

useEffect(() => {
  socket.on('newMessage', (newMessage) => {
      // console.log('Received new message from server:', newMessage);
      setMessages([...messages, newMessage]);
  });

  return () => {
      socket.off('newMessage');
  };
}, [messages]);

  
  const fetchMessages = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/mess/messages/${chatId}`, {
        headers: {
          'Authorization': `${userToken}` // Thêm Bearer vào trước token
        }
      });
      const data = await response.json();
      // console.log('Fetched Messages:', data); // Log fetched messages
      setMessages(data); // Cập nhật danh sách tin nhắn
      setMessages(data.messages); // Cập nhật danh sách tin nhắn
      setCurrentUserId(data.currentUserId); // Cập nhật userId
      setProductName(data.productName); // Cập nhật tên sản phẩm
      setProductPrice(data.productPrice); // Cập nhật giá sản phẩm
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Đảm bảo refreshing được cập nhật
    }
  };
  const markMessagesAsRead = async (chatId) => {
    try {
        // Gửi yêu cầu PUT đến API để đánh dấu các tin nhắn đã đọc
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${config.apiBaseURL}/mess/markMessagesAsRead`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${userToken}`
            },
            body: JSON.stringify({ chatId })
        });

        const data = await response.json();
        console.log('Mark as read response:', data);
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
};


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
      console.log('Sent message:', data); 
      setMessageInput('');
      fetchMessages();
      flatListRef.current.scrollToEnd({ animated: true });
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
      <View style={styles.productInfoContainer}>
        <Text style={styles.productNameText}>Product: {productName}</Text>
        <Text style={styles.productPriceText}>Price: {productPrice}</Text>
      </View>
      <FlatList
  ref={flatListRef}
  data={messages}
  keyExtractor={(item) => item._id}
  renderItem={renderMessage}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }
  onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
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
  productInfoContainer: {
    flexDirection: 'cow',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  productPriceText: {
    fontSize: 14,
    color: 'white',
  },
});

export default MessagesScreen;
