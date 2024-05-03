import React, { useState, useEffect } from 'react';
import { Modal, View,Alert, Text, TextInput, TouchableOpacity, StyleSheet, Button, Image, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import config from '../../config/config';
import styles from '../../components/ProfileAccount';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();

  const fetchUserDetails = async () => {
    const { userId } = route.params;
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Token from AsyncStorage:', userToken);
      const response = await fetch(`${config.apiBaseURL}/admin/userbyid/${userId}`, {
      headers: {
        'Authorization': `${userToken}` // Ensure you're using Bearer token if required by your backend
      }
    });
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
        setLoading(false);
        return;
      }
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setLoading(false);
    }
  };
 
  const dautichxacminhtaikhoan = async () => {
    try {
      Alert.alert('Account Verify Success', 'Dấu Tích Này Chỉ Hiển Thị Khi Tài Khoản Đã Được Xác Minh');
    } catch (error) {
      console.error('Failed', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View >
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
     
        <Image
        source={{ uri: 
          // 'https://c4.wallpaperflare.com/wallpaper/263/532/888/minimalism-ens%C5%8D-circle-simple-background-wallpaper-preview.jpg'         
          //  "https://c4.wallpaperflare.com/wallpaper/372/584/840/minimalism-samurai-warrior-simple-background-wallpaper-preview.jpg"
        // "https://c4.wallpaperflare.com/wallpaper/249/998/393/minimalism-light-bulb-dark-simple-wallpaper-preview.jpg"
        "https://c4.wallpaperflare.com/wallpaper/759/704/58/anime-manga-anime-girls-fan-art-illustration-hd-wallpaper-preview.jpg"
        // "https://c4.wallpaperflare.com/wallpaper/434/309/126/minimalism-cat-funny-digital-art-artwork-hd-wallpaper-preview.jpg"
        // "https://c4.wallpaperflare.com/wallpaper/859/305/81/neon-genesis-evangelion-ayanami-rei-blue-hair-anime-girls-wallpaper-preview.jpg"
        }}
        style={styles.coverImage}
      />
      <View style={styles.avatarContainer}>
       <TouchableOpacity>
       <Image
            source={{ uri: user.avatar_image }}
            style={styles.avatar}
          />
          </TouchableOpacity>
          <View style={styles.nameandbutton}>
              <Text style={[styles.name, styles.textWithShadow]}>{user.name}</Text>  
              <Ionicons name='checkmark-circle' size={30} color="#EA7575" style={styles.uploadIcon} onPress={() => dautichxacminhtaikhoan()} />
          </View>           
      </View>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}> {user.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Phone Number:</Text>
          <Text style={styles.infoValue}>{user.phone_number}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Cái gì đó chưa nghĩ ra có thể là hiển thị cái qq gì đó:</Text>
          <Text style={styles.infoValue}>Đẹp trai có gì sai.</Text>
        </View>
      </View>
    </View>
   
  );
}


export default UserDetail;
