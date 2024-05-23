import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';
import socket  from '../../config/socket';
import  styles from '../../components/unmess';

const ListMess = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchlistMess = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/mess/usersWhoMessaged`, {
        headers: {
          'Authorization': `${userToken}`
        }
      });
      const data = await response.json();
      // console.log('API Response:', data); // Verify the API response
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  // useEffect(() => {
  //   fetchlistMess();
  // }, []);

  useEffect(() => {
    fetchlistMess();
    socket.on('newChat', (newChat) => {
        // console.log('Received new chat from server:', newChat);
        setUsers([...users, newChat]);
    });
    return () => {
        socket.off('newChat');
    };
}, [users]); // Update the effect dependency array

  const messages = (chatId) => {
    console.log("Navigating with chatId:", chatId); // Log chatId to verify
    if (chatId) {
      console.log("chatId is defined. Navigating to MessagesScreen...");
      navigation.navigate('MessagesScreen', { chatId });
    } else {
      console.error('chatId is undefined');
    }
  }
  

  const onRefresh = () => {
    setRefreshing(true);
    fetchlistMess();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const renderUser = ({ item }) => {
    console.log("Item read status:", item.read); // In giá trị của trường read để kiểm tra
    return (
      <View style={styles.userContainer}>
        <Image source={{ uri: item.product_image }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{item.name}</Text>
          <Text style={styles.productName}>Product: {item.productName}</Text>
          <Text style={[styles.lastMessage, !item.read ? styles.unreadMessage : styles.readMessage]}>
            {item.lastMessage}
          </Text>
          {item.productName ? (
            <TouchableOpacity onPress={() => messages(item.chatId)}>
              <Text style={styles.viewMessages}>Xem tin nhắn</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.viewMessages}>Tên sản phẩm không hợp lệ</Text>
          )}
        </View>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      {users.length === 0 ? (
        <Text style={styles.noMessagesText}>Hiện chưa có tin nhắn</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

export default ListMess;
