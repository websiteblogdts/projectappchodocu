import React, { useState,useEffect  } from 'react';
// import queryString from 'query-string';
import { View, Text, Image,Alert, ScrollView, TextInput, TouchableOpacity, Button, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../components/CustomButton';
import config from '../../config/config';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import styles from '../../components/Login';
import { storeToken } from '../../store/Userlogin';
import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';
WebBrowser.maybeCompleteAuthSession();
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
// import { Linking } from 'react-native';

console.log(process.env.REACT_APP_API_BASE_URL)

function LoginScreen({ navigation }) {
  const [identifier, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  // const redirectUri = "http://127.0.0.1:8081"
  // const redirectUri = makeRedirectUri({
  //   scheme: 'com.sondtgcd191140.appchodocu',
  //   useProxy: true,
  // });
// console.log('Redirect URI:', redirectUri); // Log redirect URI

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId:'1091400332076-0bvhj0cr855rd92q6o62s4h3q5koj98e.apps.googleusercontent.com',
    // androidClientId:'1091400332076-57g4l7n282dprqbpvn3pl3b7kulg69rj.apps.googleusercontent.com',
    expoClientId: '1091400332076-57g4l7n282dprqbpvn3pl3b7kulg69rj.apps.googleusercontent.com',
    iosClientId:'1091400332076-o4f39c79j8og43vbjb79cbrginprr5m2.apps.googleusercontent.com',
    webClientId: '1091400332076-57g4l7n282dprqbpvn3pl3b7kulg69rj.apps.googleusercontent.com',
    // redirectUri:redirectUri,

  });



useEffect(() => {
  // console.log('Current response:', response); // Kiểm tra giá trị của response

  if (response && response.type === 'success') {
    // console.log('Google login response:', response);
    const { params } = response;
    if (params) {
      const { id_token } = params; // Lấy ID token từ phản hồi
      // console.log('Google ID Token:', id_token);
      handleGoogleLogin(id_token); // Truyền ID token vào hàm
    } else {
      console.error('Params is undefined');
    }
  }
}, [response]);


const handleGoogleLogin = async (idToken) => {
  try {
    const apiURL = `${config.apiBaseURL}/auth/google/login`; // Đảm bảo config.apiBaseURL đã được định nghĩa chính xác

    const { data } = await axios.post(apiURL, { token: idToken });

    // console.log('Response from server:', data); // In ra phản hồi từ máy chủ

    // Kiểm tra nếu data.user tồn tại và có trường role
    if (data.user && data.user.role) {
      console.log('User Role:', data.user.role);
      if (data && data.token) {
        // Sử dụng hàm storeToken để lưu thông tin người dùng
        await storeToken(data.token, data.user.role, data.user._id, data.otpVerified);
        console.log('Token saved:', data.token); // In ra token để kiểm tra
      }
      Alert.alert('Login Success', `Welcome ${data.user.name}`);
      navigation.navigate(data.user.role === 'admin' ? 'Admin' : 'User');
    } else {
      throw new Error('Role not found in response');
    }
  } catch (error) {
    // console.error('Login failed:', error);
    Alert.alert('Error', 'Failed to login with Google');
  }
};


const handleLogin = async () => {
  try {
      const userData = {
          identifier: identifier,
          password: password
      };
      // console.log('Logging in with:', userData);
      const apiURL = `${config.apiBaseURL}/user/login`;
      const response = await axios.post(apiURL, userData);

      // console.log('API URL:', apiURL);

      // const response = await axios.post(apiURL, userData, { withCredentials: true });

      // const response = await axios.post(`${config.apiBaseURL}/user/login`, userData);
      const { token, role, user } = response.data; // Lấy user từ response data
      // const userId = user._id;
      // console.log(response.data)
      const account_status = user.account_status; // Lấy account_status từ user

      // console.log('Account Status:', account_status);

      await storeToken(token, role, user._id, account_status);

      // console.log('Login successful! Role:', role, 'UserId:', userId, 'Token:', token); // Hiển thị role, token và userId trong terminal

      navigation.navigate(role === 'admin' ? 'Admin' : 'User'); // Navigation dựa trên role
  } catch (error) {
    // console.error("Login error:", error.response ? error.response.data : error.message); // Log chi tiết lỗi
    Alert.alert('Error', error.response ? error.response.data.error : 'An unexpected error occurred.'); // Hiển thị thông báo lỗi từ BE
  }
};


  return (
    <SafeAreaView style={{flex: 1,backgroundColor:'#3B3B3B', justifyContent: 'center'}}>
       <KeyboardAvoidingView 
        style={{flex: 1}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <View style={styles.logoContainer}>
        <Image
          source={{ uri: "https://res.cloudinary.com/dvm8fnczy/image/upload/v1713510313/vrzu6ljfyvevdfzatyzf.jpg" }}
          style={styles.logo}
        />
        </View>

        <View style={{paddingHorizontal: 25}}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 30,
          }}>
          Login
        </Text>

        <View style={styles.inputContainer}>
        <MaterialIcons
          name="alternate-email"
          size={20}
          color="white"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email or SDT"
          placeholderTextColor="#888"
          value={identifier}
          onChangeText={text => setEmailOrPhone(text)}
        />
         </View>   


              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="lock"
                  size={20}
                  color="white"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={text => setPassword(text)}
                  secureTextEntry={true}
                />
                <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
                      <Text style={styles.forgotPassword}>Forgot?</Text>
                </TouchableOpacity>
              </View>


              <CustomButton label={"Login"} onPress={handleLogin} />


     
      <Text style={{textAlign: 'center', color: '#888', marginBottom: 30}}>
          Or, login with ...

        </Text>


   <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30}}>


              {/* <TouchableOpacity
              title={accessToken ? "get user Data": "Login"}
               onPress={accessToken ? getUserData : () => promptAsync({ useProxy: true,showInRecents: true })}
                style={{borderColor: '#ddd', borderWidth: 2, borderRadius: 10, paddingHorizontal: 60, paddingVertical: 10}}>
                <MaterialCommunityIcons name="google" size={30} color="#EA7575" />
              </TouchableOpacity> */}
              <TouchableOpacity
              onPress={() => promptAsync({ useProxy: true,showInRecents: true })}
                // onPress={handlePress} // Không cần dấu ngoặc nhọn kép, chỉ cần truyền hàm
                style={{borderColor: '#ddd', borderWidth: 2, borderRadius: 10, paddingHorizontal: 60, paddingVertical: 10}}>
                <MaterialCommunityIcons name="google" size={30} color="#EA7575" />
              </TouchableOpacity>

              {/* <TouchableOpacity
              onPress={() => promptAsync({ useProxy: true,showInRecents: true })}
                // onPress={handlePress} // Không cần dấu ngoặc nhọn kép, chỉ cần truyền hàm
                style={{borderColor: '#ddd', borderWidth: 2, borderRadius: 10, paddingHorizontal: 60, paddingVertical: 10}}>
                <MaterialCommunityIcons name="facebook" size={30} color="#75ABEA" />
              </TouchableOpacity> */}

            </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterUser')}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Register</Text>
          </TouchableOpacity>
        </View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;