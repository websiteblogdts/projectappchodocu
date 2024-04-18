import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet ,Button} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

function UserProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

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
      <Text style={styles.heading}>User Profile</Text>
      <Text>Name: {userData.name}</Text>
      <Text>Email: {userData.email}</Text>
      <Text>Phone Number: {userData.phone_number}</Text>
      <Button title="Logout" onPress={handleLogout} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default UserProfileScreen;
