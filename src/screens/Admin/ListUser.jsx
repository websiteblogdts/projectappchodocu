import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert, Modal, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';

const ListUser = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

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
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Name/Mail/Phone"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <TouchableOpacity onPress={() => console.log('Search')}>
            <Ionicons name="search" size={24} color="white" style={{ marginRight: 10 }} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, searchText]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.phone_number.toLowerCase().includes(searchText.toLowerCase())
  );

  const fetchUsers = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${config.apiBaseURL}/admin/getalluser`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
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
      const userToken = await AsyncStorage.getItem('userToken');
      await axios.put(`${config.apiBaseURL}/admin/changstatusaccount/${userId}`, null, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi khóa/mở khóa tài khoản:', error);
    }
  };

  const editUser = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      await axios.put(`${config.apiBaseURL}/admin/edituser/${selectedUserId}`, editUserData, {
        headers: {
          'Authorization': `Bearer ${userToken}`
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

  const deleteUser = async (id) => {
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
                'Authorization': `Bearer ${userToken}`
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
                color={item.account_status === 'active' ? 'green' : '#E54646'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      
      {filteredUsers.length === 0 ? (
        <Text style={styles.emptyText}>No data found</Text>
      ) : (
        <FlatList
          data={filteredUsers}
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
              onChangeText={(text) => setEditUserData({ ...editUserData, phone_number: text })}
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
              style={styles.picker}
              onValueChange={(itemValue) => setEditUserData({ ...editUserData, role: itemValue })}
            >
              <Picker.Item label="User" value="user" />
              <Picker.Item label="Moderator" value="moderator" />
            </Picker>
            <Picker
              selectedValue={editUserData.account_status}
              style={styles.picker}
              onValueChange={(itemValue) => setEditUserData({ ...editUserData, account_status: itemValue })}
            >
              <Picker.Item label="Active" value="active" />
              <Picker.Item label="Locked" value="locked" />
            </Picker>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={editUser} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
  searchInput: {
    backgroundColor: '#555',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 8 : 5,
    color: 'white',
    marginRight: 10,
    width: 200,
  },
  userContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    color: 'gray',
  },
  nutchucnang: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
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
    color: 'white',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
textAlign: 'center',
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: 'white',
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
  flatListContent: {
    paddingBottom: 100,
   
      // borderWidth: 1,
      // borderColor: '#ccc',
      // borderRadius: 5,
      // paddingVertical: 10,
      // paddingHorizontal: 15,
      // marginBottom: 15,
      // color: 'white',
      // backgroundColor: '#3B3B3B',
      // // flex: 1,
      // padding: 10,
    
  },
  webSelect: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: 'white',
    backgroundColor: '#3B3B3B',
    flex: 1,
    padding: 10,
  },
});

export default ListUser;
