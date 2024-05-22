import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';

const MessagesScreen = ({ route }) => {
  const { chatId } = route.params;
  console.log("Received chatId:", chatId); // Log received chatId
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${config.apiBaseURL}/mess/messages/${chatId}`, {
          headers: {
            'Authorization': `${userToken}`
          }
        });
        const data = await response.json();
        console.log('Fetched Messages:', data); // Log fetched messages
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchMessages();
    } else {
      console.error('chatId is undefined');
      setLoading(false);
    }
  }, [chatId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#414141" />;
  }

  const renderMessage = ({ item }) => (
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

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#414141',
  },
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontWeight: 'bold',
  },
  content: {
    marginTop: 5,
  },
});

export default MessagesScreen;
