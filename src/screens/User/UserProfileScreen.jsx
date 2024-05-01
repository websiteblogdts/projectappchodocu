import React, { useState, useEffect } from 'react';
import { Modal, View,Alert, Text, TextInput, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Icon from 'react-native-vector-icons/FontAwesome'
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import styles from '../../components/ProfileAccount';

function UserProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newAvatarImage, setImages] = useState([]);
  const [originalAvatar, setOriginalAvatar] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  //bên dưới là mắt xem pass  tham khảo internet nhé
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (userData && userData.avatar_image) {
        setCurrentAvatar(userData.avatar_image);
        // Đặt URL avatar ban đầu khi tải dữ liệu người dùng
        setOriginalAvatar(userData.avatar_image);
    }
}, [userData]);

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
  
  const dautichxacminhtaikhoan = async () => {
    try {
      Alert.alert('Account Verify Success', 'Dấu Tích Này Chỉ Hiển Thị Khi Tài Khoản Đã Được Xác Minh');
    } catch (error) {
      console.error('Failed', error);
    }
  };

  const handleChangeAvatar = async () => {
   
    if (currentAvatar === originalAvatar) {
      Alert.alert('No Changes', 'No changes to the avatar.');
      return;
  }
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token from AsyncStorage:', token);
      if (!token) {
        console.log('Token not found');
        return;
      }
      const response = await axios.put('http://appchodocu.ddns.net:3000/user/changeavatar', {
        newAvatarImage: currentAvatar
      }, {
        headers: {
          Authorization: `${token}`, 
        },
      });
      console.log(response.data);
      if (response.data) {
        console.log(response.data);
        setOriginalAvatar(currentAvatar);  // Cập nhật originalAvatar
        Alert.alert('Success', 'Avatar successfully changed');
    }
      Alert.alert('Success', 'Avatar successfully changed');
    } catch (error) {
      setCurrentAvatar(originalAvatar);
      if (error.response) {
        // Error message from server
        Alert.alert('Error', error.response.data.error);
      } else {
        // General error message
        Alert.alert('Error', 'Failed to change Avatar');
      }
    }
  };

const handleUpload = async (image) => {
  // Tạo một đối tượng FormData để gửi dữ liệu
  let formData = new FormData();
  // Thêm dữ liệu ảnh và các thông tin cần thiết cho Cloudinary vào formData
  formData.append('file', {
    uri: image.uri, // đường dẫn tới file ảnh
    type: 'image/jpeg', // loại của file
    name: 'upload.jpg' // tên file
  });
  formData.append('upload_preset', 'ackgbz0m'); // Preset bạn đã tạo trong Cloudinary
  formData.append('cloud_name', 'dvm8fnczy'); // Tên Cloud của bạn

  try {
    const response = await axios.post("https://api.cloudinary.com/v1_1/dvm8fnczy/image/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Thông báo định dạng dữ liệu gửi đi là form data
      }
    });
    if (response.status === 200) {
      console.log("Upload successful: ", response.data);
      const newAvatarUrl = response.data.secure_url;
      if (newAvatarUrl === originalAvatar) {
        Alert.alert('Avatar Unchanged', 'The new avatar is the same as the current one.');
    } else {
        setCurrentAvatar(newAvatarUrl);
        Alert.alert('Upload Successful', 'Your image has been uploaded successfully, click Save if you like this avatar!');
    }
    setModal(false);
} else {
    throw new Error("Failed to upload image");
}
} catch (error) {
console.error("Error uploading image: ", error);
Alert.alert('Upload Failed', 'Failed to upload image.');
}
};

  const _uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled) {
      handleUpload(result.assets[0]);
    } else {
      console.log("Image selection was cancelled");
    }
  };
  
  const _takePhoto = async () => {
    // Same here for camera permissions
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
    }
    const result = await ImagePicker.launchCameraAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });
  
    if (!result.cancelled) {
        handleUpload(result.assets[0]);
      } else {
        console.log("Image selection was cancelled");
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
        source={{ uri: 
          // 'https://c4.wallpaperflare.com/wallpaper/263/532/888/minimalism-ens%C5%8D-circle-simple-background-wallpaper-preview.jpg'         //  "https://c4.wallpaperflare.com/wallpaper/372/584/840/minimalism-samurai-warrior-simple-background-wallpaper-preview.jpg"
        // "https://c4.wallpaperflare.com/wallpaper/249/998/393/minimalism-light-bulb-dark-simple-wallpaper-preview.jpg"
        "https://c4.wallpaperflare.com/wallpaper/759/704/58/anime-manga-anime-girls-fan-art-illustration-hd-wallpaper-preview.jpg"
        // "https://c4.wallpaperflare.com/wallpaper/434/309/126/minimalism-cat-funny-digital-art-artwork-hd-wallpaper-preview.jpg"
        // "https://c4.wallpaperflare.com/wallpaper/859/305/81/neon-genesis-evangelion-ayanami-rei-blue-hair-anime-girls-wallpaper-preview.jpg"
        }}
        style={styles.coverImage}
      />
      <View style={styles.avatarContainer}>
       <TouchableOpacity onPress={() => setModal(true)}>
            <Image
              source={{ uri: currentAvatar }}
              style={styles.avatar}
            />
            
          </TouchableOpacity>
          <View style={styles.nameandbutton}>
              <Text style={[styles.name, styles.textWithShadow]}>{userData.name}</Text>  
              <IconButton icon="shield-check" style={styles.uploadIcon} onPress={() => dautichxacminhtaikhoan()} />
          </View>
          <IconButton icon="content-save" style={styles.uploadIcon} onPress={() => handleChangeAvatar()} />
           <Modal
             animationType='slide'
             transparent={true}
             visible={modal}
             onRequestClose= {() => {setModal(false)}}
            >
                <View style={styles.modalView}>
                    <View style={styles.buttonModalView}>
                        <IconButton icon="camera" onPress={_takePhoto} />
                        <IconButton icon="folder-image" onPress={_uploadImage} />                
                    </View>
                   <IconButton icon="cancel" style={styles.cancelupload} mode="contained" onPress={() => setModal(false)} />
                </View>
            </Modal>
                
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

export default UserProfileScreen;
