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
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchlistMess = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      setCurrentUserId(userId);
      const response = await fetch(`${config.apiBaseURL}/mess/usersWhoMessaged`, {
        headers: {
          'Authorization': `${userToken}`
        }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchlistMess();
    socket.on('newChat', (newChat) => {
        setUsers([...users, newChat]);
    });
    return () => {
        socket.off('newChat');
    };
  }, [users]);

  const messages = (chatId) => {
    if (chatId) {
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
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  const renderUser = ({ item }) => {
    const isMessageFromCurrentUser = item.senderId === currentUserId;

    return (
      <View style={styles.userContainer}>
        <Image source={{ uri: item.product_image }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{item.name}</Text>
          <Text style={styles.productName}>Product: {item.productName}</Text>
          <Text
            style={[
              styles.lastMessage,
              !item.read && !isMessageFromCurrentUser ? styles.unreadMessage : styles.readMessage
            ]}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          )}

          {item.productName ? (
            <TouchableOpacity onPress={() => messages(item.chatId)}>
              <Text
                style={[
                  styles.viewMessages,
                  !item.read && !isMessageFromCurrentUser ? styles.unreadMessage : null
                ]}
              >
                Xem tin nhắn
              </Text>
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
