import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet ,Button,Image, TouchableOpacity} from 'react-native';
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

      <TouchableOpacity style={styles.button}  >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
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
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default UserProfileScreen;
