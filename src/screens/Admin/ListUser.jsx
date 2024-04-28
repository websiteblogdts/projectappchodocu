import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ListUser = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Token from AsyncStorage:', userToken);
  
      // Use axios to make the HTTP request with the Authorization header
      const response = await axios.get('http://appchodocu.ddns.net:3000/admin/getalluser', {
        headers: {
          'Authorization': `${userToken}` // Ensure you're using Bearer token if required by your backend
        }
      });
  
      // Set the users data using the response data
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUsers();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers().then(() => setRefreshing(false));
  };

  const navigateToUserDetail = (userId) => {
    navigation.navigate('UserDetail', { userId });
  };

  const deleteUser = async (id, token) => { // Include `token` as an argument if it's not globally available
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: async () => {
          try {
            const userToken = await AsyncStorage.getItem('userToken');
            console.log('Token from AsyncStorage:', userToken);
            // Make the delete request with Authorization header
            await axios.delete(`http://appchodocu.ddns.net:3000/admin/user/delete/${id}`, {
              headers: {
                'Authorization': `${userToken}` // Correct way to include the token
              }
            });
            fetchUsers();
            Alert.alert("Success", "User deleted successfully");
          } catch (error) {
            console.error('Failed to delete user:', error);
            Alert.alert('Error', 'Failed to delete user');
          }
        }}
      ]
    );
  };

  const renderUser = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigateToUserDetail(item._id)}>
        <View style={styles.userContainer}>
          <Text style={styles.name}>Name:{item.name}</Text>
          <Text style={styles.email}>Mail:{item.email}</Text>
          <Text>Phone:{item.phone_number}</Text>
          <TouchableOpacity onPress={() => deleteUser(item._id)} style={styles.deleteButton}>
          <Text>Delete</Text>
        </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {users.length === 0 ? (
        <Text style={styles.emptyText}>No users found</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.flatListContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E6E6E6',
  },
  userContainer: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    marginBottom: 15,
    marginHorizontal: 2,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContent: {
    flexGrow: 1,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
});

export default ListUser;
