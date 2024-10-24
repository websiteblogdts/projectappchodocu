import React, { useState, useEffect } from 'react';
import { Modal, View, Alert, Text, TextInput, TouchableOpacity, ActivityIndicator, Image,RefreshControl  } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { storeToken } from '../../store/Userlogin';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import styles from '../../components/ProfileAccount';
import OtpModalStyles from '../../components/OtpModalStyles'; // Đảm bảo đường dẫn chính xác

import config from '../../config/config';

function UserProfileScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newAvatarImage, setImages] = useState([]);
  const [originalAvatar, setOriginalAvatar] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [accountStatus, setAccountStatus] = useState(false); // State for OTP verification
  const [email, setEmail] = useState('');
  const [otpVerified, setOtpVerified] = useState(false); // Trạng thái xác minh OTP
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [vipExpiryDate,setVipExpiryDate] = useState("");

  useEffect(() => {

    navigation.setOptions({
      headerRight: () => (
        <Ionicons name='log-out' title="Logout" size={40} color="#EA7575" style={styles.iconlogout} onPress={handleLogout} />
        ),
    });

    if (userData && userData.avatar_image) {
      setCurrentAvatar(userData.avatar_image);
        // Đặt URL avatar ban đầu khi tải dữ liệu người dùng
        setOriginalAvatar(userData.avatar_image);
    }
    if (userData && userData.email) {
      setEmail(userData.email);
      console.log(userData.email);
  }
}, [userData]);
console.log(userData)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const account_status = await AsyncStorage.getItem('account_status'); // Fetch OTP verification status
        const token = await AsyncStorage.getItem('userToken');
        // const  account_status  = await storeToken(); // Get token and otpVerified from AsyncStorage
        console.log('Token from AsyncStorage:', token);
        console.log(account_status);
        if (token) {
          const response = await axios.get(`${config.apiBaseURL}/user/profile`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
      
          // setAccountStatus(account_status); // Set the otpVerified state
          setUserData(response.data);
          setLoading(false);
        } else {
          console.log('Token not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    
  }, []);
 
  useEffect(() => {
    let timer;
    if (countdown > 0 && otpModalVisible) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && otpModalVisible) {
      setOtpExpired(true);
      Alert.alert("OTP expired. You can request a new one.");
    }
    return () => clearInterval(timer);
  }, [countdown, otpModalVisible]);

  const startCountdown = () => {
    setCountdown(30); // Đặt lại thời gian đếm ngược
    setOtpExpired(false); // Xóa trạng thái hết hạn
  };
  const openChangePasswordModal = () => {
    // Clear the password fields before showing the modal
    setOldPassword('');
    setNewPassword('');
    // Open the modal
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setOtpModalVisible(false);
    setOtpCode('');
  };
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${config.apiBaseURL}/otp/verify-otp`, { email, otpCode });
      setOtpVerified(true);
      setOtpModalVisible(false);
      fetchUserData();
      onRefresh();
      Alert.alert(res.data.message);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert('Failed to verify OTP');
    }
  };
  const handleRequestOtp = async () => {
    try {
      const res = await axios.post(`${config.apiBaseURL}/otp/send-otp-after`, { email });
      // Alert.alert(res.data.message);
      startCountdown();
      setOtpModalVisible(true);
    } catch (error) {
      console.error("Error requesting OTP:", error);
    }
  };
  
  
    const fetchUserData = async () => {
      try {
        const account_status = await AsyncStorage.getItem('account_status'); // Fetch OTP verification status
        const vipExpiryDate = await AsyncStorage.getItem('vipExpiryDate'); // Fetch OTP verification status

        const token = await AsyncStorage.getItem('userToken');
        // const  account_status  = await storeToken(); // Get token and otpVerified from AsyncStorage
        console.log('Token from AsyncStorage:', token);
        console.log(account_status);
        console.log ("Vip",vipExpiryDate)

        if (token) {
          const response = await axios.get(`${config.apiBaseURL}/user/profile`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });

          // setVipExpiryDate(vipExpiryDate);
          setAccountStatus(account_status); // Set the otpVerified state
          setUserData(response.data);
          setLoading(false);
        } else {
          console.log('Token not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const onRefresh = () => {
      setRefreshing(true);
      fetchUserData().then(() => setRefreshing(false));
    };
  

  const handleChangePassword = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // console.log('Token from AsyncStorage:', token);
      console.log('Old Password:', oldPassword);
      console.log('New Password:', newPassword);
      if (!token) {
        console.log('Token not found');
        return;
      }
      const response = await axios.put(`http${config.apiBaseURL}/user/updatepass`, {
        oldPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`, 
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
  
  const viewvip = async () => {
    try {
      Alert.alert('Hạn Vip Của Bạn Là Ngày: ');
    } catch (error) {
      console.error('Failed', error);
    }
  };

  const dautichxacminhtaikhoan = async () => {
    try {
      Alert.alert('Account Verify Success', 'Dấu Tích Này Chỉ Hiển Thị Khi Tài Khoản Đã Được Xác Minh');
    } catch (error) {
      console.error('Failed', error);
    }
  };
  const dautichchuaxacminhtaikhoan = async () => {
    try {
      Alert.alert(
        'Account Verify Pending',
        'Dấu Tích Này Chỉ Hiển Thị Khi Tài Khoản Chưa Được Xác Minh',
        [
          {
            text: 'Verify OTP',
            onPress: () => handleRequestOtp(), // Gọi hàm yêu cầu xác minh OTP
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
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
      const response = await axios.put(`${config.apiBaseURL}/user/changeavatar`, {
        newAvatarImage: currentAvatar
      }, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      console.log(response.data);
      if (response.data) {
        console.log(response.data);
        setOriginalAvatar(currentAvatar);  // Cập nhật originalAvatar
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
      console.log('userToken', tokenAfterLogout)
      // Chuyển hướng đến màn hình đăng nhập
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }
  return (
    <KeyboardAwareScrollView
    style={{ flex: 1}}
    extraScrollHeight={1}
    // enableOnAndroid={true}
    keyboardShouldPersistTaps='handled'
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
    
  >
    <View style={styles.container}>
        <Image
        source={{ uri: 
          // 'https://c4.wallpaperflare.com/wallpaper/263/532/888/minimalism-ens%C5%8D-circle-simple-background-wallpaper-preview.jpg'         
          //  "https://c4.wallpaperflare.com/wallpaper/372/584/840/minimalism-samurai-warrior-simple-background-wallpaper-preview.jpg"
        // "https://c4.wallpaperflare.com/wallpaper/249/998/393/minimalism-light-bulb-dark-simple-wallpaper-preview.jpg"
        // "https://c4.wallpaperflare.com/wallpaper/759/704/58/anime-manga-anime-girls-fan-art-illustration-hd-wallpaper-preview.jpg"
        "https://c4.wallpaperflare.com/wallpaper/434/309/126/minimalism-cat-funny-digital-art-artwork-hd-wallpaper-preview.jpg"
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
         
            {/* {!otpVerified && (
        <TouchableOpacity style={styles.button} onPress={handleRequestOtp}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
      )} */}

            {userData.account_status === 'active' ? (
              <Ionicons 
                name='checkmark-circle' 
                size={27} 
                color="#4CAF50" // Màu xanh cho tài khoản đã xác minh
                style={styles.uploadIcon} 
                onPress={() => dautichxacminhtaikhoan()} 
              />
            ) : (
              <Ionicons 
                name='warning-outline' 
                size={27} 
                color="#EA7575" // Màu đỏ cho tài khoản chưa xác minh
                style={styles.uploadIcon} 
                onPress={() => dautichchuaxacminhtaikhoan()} 
              />
            )}
          </View>

          <Text style={styles.reward_points}>Points: {userData.reward_points}
          <FontAwesome5 name="crown" onPress={viewvip} />
          </Text>
          
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
          <Text style={styles.infoLabel}>Email: {userData.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Phone Number: {userData.phone_number}</Text>
        </View>
        <View style={styles.infoContainer}>
        <TouchableOpacity style={styles.button} onPress={openChangePasswordModal}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconvatextsave}>
      <Text style={styles.texticonsave}>Save All</Text>
      <Ionicons name='save' style={styles.iconsave} size={35} color="#EA7575" onPress={() => handleChangeAvatar()} />
      </TouchableOpacity>
        </View>
       
      </View>

   

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={otpModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={OtpModalStyles.modalContainer}>
          <View style={OtpModalStyles.modalContent}>
            <Text style={OtpModalStyles.modalHeader}>Nhập mã OTP</Text>
            <TextInput
              style={OtpModalStyles.input}
              placeholder="Mã OTP"
              keyboardType="numeric"
              value={otpCode}
              onChangeText={setOtpCode}
            />
            <TouchableOpacity style={OtpModalStyles.button} onPress={handleVerifyOtp}>
              <Text style={OtpModalStyles.buttonText}>Xác minh OTP</Text>
            </TouchableOpacity>
            {otpExpired && <Text style={OtpModalStyles.countdownText}>Mã OTP đã hết hạn!</Text>}
            {countdown > 0 && <Text style={OtpModalStyles.countdownText}>Còn lại: {countdown} giây</Text>}
            <TouchableOpacity onPress={handleRequestOtp}>
              <Text style={{ textAlign: 'center', marginTop: 20 }}>Gửi lại mã OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={{ textAlign: 'center', marginTop: 10 }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </KeyboardAwareScrollView>

  );
}

export default UserProfileScreen;
