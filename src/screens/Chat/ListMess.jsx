import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';

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
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchlistMess();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderUser = ({ item }) => (
    <View style={styles.userContainer}>
      <Image source={{ uri: item.avatar_image }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.username}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.content}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Messages', { chatId: item.chatId })}>
          <Text style={styles.viewMessages}>Xem tin nhắn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUser}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
  userContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  lastMessage: {
    color: 'white',
  },
  viewMessages: {
    color: 'gray',
    marginTop: 5,
  },
});

export default ListMess;