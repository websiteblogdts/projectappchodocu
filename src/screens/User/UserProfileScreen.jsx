import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

function UserProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Lấy token từ AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        
        // Kiểm tra nếu token tồn tại
        if (token) {
          const response = await axios.get('http://appchodocu.ddns.net:3000/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
        } else {
          // Xử lý trường hợp không tìm thấy token
          console.log('Token not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

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
