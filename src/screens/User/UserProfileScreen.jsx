import React, { useState, useEffect } from 'react';
import { Modal, View,Alert, Text, TextInput, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Icon from 'react-native-vector-icons/FontAwesome'

function UserProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  //bên dưới là mắt xem pass  tham khảo internet nhé
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Token from AsyncStorage:', token);
        if (token) {
          const response = await axios.get('http://appchodocu.ddns.net:3000/user/profile', {
            headers: {
              Authorization: `${token}`, 
            },
          });
          setUserData(response.data);
        } else {
          console.log('Token not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const openChangePasswordModal = () => {
    // Clear the password fields before showing the modal
    setOldPassword('');
    setNewPassword('');
    // Open the modal
    setModalVisible(true);
  };

  const handleChangePassword = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token from AsyncStorage:', token);
      console.log('Old Password:', oldPassword);
      console.log('New Password:', newPassword);
      if (!token) {
        console.log('Token not found');
        return;
      }
      const response = await axios.put('http://appchodocu.ddns.net:3000/user/updatepass', {
        oldPassword,
        newPassword
      }, {
        headers: {
          Authorization: `${token}`, 
        },
      });
      console.log(response.data);
      Alert.alert('Success', 'Password successfully changed');
      setModalVisible(false);
    } catch (error) {
      setOldPassword('');
      setNewPassword('');
      if (error.response) {
        // Error message from server
        Alert.alert('Error', error.response.data.error);
      } else {
        // General error message
        Alert.alert('Error', 'Failed to change password');
      }
      // console.error('Failed to change password:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Xóa token từ AsyncStorage
      await AsyncStorage.removeItem('userToken');
      
      // Kiểm tra xem token đã được xóa thành công hay không
      const tokenAfterLogout = await AsyncStorage.getItem('userToken');
      
      if (tokenAfterLogout === null) {
        console.log('Token has been successfully removed from AsyncStorage.');
      } else {
        console.log('Failed to remove token from AsyncStorage.');
      }
      
      // Chuyển hướng đến màn hình đăng nhập
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
        <Image
        source={{ uri: 'https://www.bootdey.com/image/900x400/FF7F50/000000' }}
        style={styles.coverImage}
      />
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: userData.avatar_image }}
          style={styles.avatar}
        />
        <Text style={[styles.name, styles.textWithShadow]}>{userData.name}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}> {userData.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Phone Number:</Text>
          <Text style={styles.infoValue}>{userData.phone_number}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Cái gì đó chưa nghĩ ra có thể là hiển thị cái qq gì đó:</Text>
          <Text style={styles.infoValue}>Đẹp trai có gì sai.</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={openChangePasswordModal}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            
          <View style={styles.inputContainer}>   
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              secureTextEntry={!isOldPasswordVisible}
              onChangeText={setOldPassword}
              value={oldPassword}
            />
            <TouchableOpacity
              onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)}>
              <Icon name={isOldPasswordVisible ? "eye" : "eye-slash"} size={20} color="grey" />
            </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}> 
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={!isNewPasswordVisible}
              onChangeText={setNewPassword}
              value={newPassword}
            />
            <TouchableOpacity
              onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
              <Icon name={isNewPasswordVisible ? "eye" : "eye-slash"} size={20} color="grey" />
            </TouchableOpacity>
            </View>

            <View style={styles.submitandcancel}>
            <TouchableOpacity style={[styles.buttonsubmit, styles.buttonsubmit2]} onPress={handleChangePassword} >
              <Text style={styles.textStyle}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonsubmit, styles.buttonsubmit2]} onPress={() => setModalVisible(false)} >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
      <Button title="Logout" onPress={handleLogout} />
    </View>
   
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  coverImage: {
    height: 200,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color:'white'
  },
  content: {
    marginTop: 20,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoValue: {
    marginTop: 5,
  },
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
  },
  buttonsubmit: {
    // backgroundColor: '#0066cc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'pink',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonsubmit2: {
    backgroundColor: 'gray',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 10,
  }, 
  submitandcancel : {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  }
});


export default UserProfileScreen;
