import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import config from '../../config/config';

const ListUser = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [editUserData, setEditUserData] = useState({
    name: '',
    password: '',
    reward_points: '',
    role: '',
    account_status: '',
    email: '',
    phone_number: ''
  });
  
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // console.log('Token from AsyncStorage:', userToken);
        const response = await axios.get(`${config.apiBaseURL}/admin/getalluser`, {
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

  const handleLockUnlockAccount = async (userId) => {
    try {
      console.log('User ID:', userId);
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Request URL:', `${config.apiBaseURL}/admin/changstatusaccount/${userId}`);
        await axios.put(`${config.apiBaseURL}/admin/changstatusaccount/${userId}`, null, {
        headers: {
          'Authorization': `${userToken}`
        }
      });
      fetchUsers();
      console.log('Account status changed successfully'); // In ra thông báo khi thay đổi thành công
    } catch (error) {
      console.error('Lỗi khi khóa/mở khóa tài khoản:', error); // In ra lỗi nếu có
    }
  };
  

  const editUser = async () => {
    try {
      console.log('Edit user data:', editUserData);
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Token from AsyncStorage:', userToken);      // Make the edit request with Authorization header
      await axios.put(`${config.apiBaseURL}/admin/edituser/${selectedUserId}`, editUserData, {
        headers: {
          'Authorization': `${userToken}`
        }
      });
      fetchUsers();
      setModalVisible(false);
      Alert.alert("Success", "User updated successfully");
    } catch (error) {
      console.error('Failed to update user:', error);
      if (error.response && error.response.data && error.response.data.error) {
          Alert.alert('Error rui', error.response.data.error);
      } else {
        Alert.alert('Error rui son oi', error.response.data.error || 'Failed to add product');
          Alert.alert('Error', 'Failed to update user');
      }
    }
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
            await axios.delete(`${config.apiBaseURL}/admin/user/delete/${id}`, {
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
          <TouchableOpacity onPress={() => navigateToUserDetail(item._id)}>
            <View>
              <Text style={styles.name}>Name: {item.name}</Text>
              <Text style={styles.email}>Mail: {item.email}</Text>
              <Text style={styles.email}>Phone: {item.phone_number}</Text>
              <Text style={styles.email}>Points: {item.reward_points}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.nutchucnang}>
            <TouchableOpacity onPress={() => {
              setSelectedUserId(item._id);
              setEditUserData({
                name: item.name,
                email: item.email,
                phone_number: item.phone_number,
                password: '',
                reward_points: item.reward_points.toString(),
                role: item.role,
                account_status: item.account_status
              });
              setModalVisible(true);
            }}>
              <Ionicons name="create-outline" size={30} color="#1E90FF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteUser(item._id)}>
              <Ionicons name="trash-bin" size={30} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLockUnlockAccount(item._id)}>
            <Ionicons 
                name={item.account_status === 'active' ? 'lock-open' : 'lock-closed'} 
                size={30} 
                color={item.account_status === 'active' ? 'green' : '#E54646'} // Màu cam nếu tài khoản đang active, màu đỏ nếu tài khoản đang bị khóa
              />
            </TouchableOpacity>
          </View>
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

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#888"
              value={editUserData.name}
              onChangeText={(text) => setEditUserData({ ...editUserData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={editUserData.email}
              onChangeText={(text) => setEditUserData({ ...editUserData, email: text })}
            />
          <TextInput 
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={editUserData.phone_number}
            onChangeText={(text) => setEditUserData({ ...editUserData, phone_number: text})}
          />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#888"
              secureTextEntry={true}
              value={editUserData.password}
              onChangeText={(text) => setEditUserData({ ...editUserData, password: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Reward Points"
              placeholderTextColor="#888"
              value={editUserData.reward_points}
              onChangeText={(text) => setEditUserData({ ...editUserData, reward_points: text })}
            />
            <Picker
              selectedValue={editUserData.role}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) =>
                setEditUserData({ ...editUserData, role: itemValue })
              }>
              <Picker.Item label="User" value="user" />
              <Picker.Item label="Moderator" value="moderator" />
            </Picker>
            <Picker
              selectedValue={editUserData.account_status}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) =>
                setEditUserData({ ...editUserData, account_status: itemValue })
              }>
              <Picker.Item label="Active" value="active" />
              <Picker.Item label="Locked" value="locked" />
            </Picker>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => editUser()}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#3B3B3B',
  },
  userContainer: {
    backgroundColor: '#414141',
    borderRadius: 16,
    marginBottom: 15,
    marginHorizontal: 2,
    padding: 10,
    elevation: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
  nutchucnang:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#3B3B3B',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    color: "white"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "white"

  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "white"
  },
  saveButton: {
    backgroundColor: 'gray',
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FF4500',
    borderRadius: 5,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ListUser;
