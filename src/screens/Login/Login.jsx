import React, { useState } from 'react';
import { View, Text, Image,Alert, ScrollView, TextInput, TouchableOpacity,  KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../components/CustomButton';
import config from '../../config/config';
// import { useAuthRequest } from 'expo-auth-session';
// import * as Google from 'expo-auth-session/providers/google';


console.log(process.env.REACT_APP_API_BASE_URL)
// import CookieManager from '@react-native-cookies/cookies';
import styles from '../../components/Login';
import { storeToken } from '../../store/Userlogin'; // Import saveToken

function LoginScreen({ navigation }) {
  const [identifier, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  // const [request, response, promptAsync] = useAuthRequest({
  //   responseType: 'token',
  //   clientId: '537502668452-6r7i03nd3470lq0s42p70dvm956ge624.apps.googleusercontent.com',
  //   scopes: ['profile', 'email'],
  //   redirectUri: 'http://appchodocutest.ddns.net:3000/auth/google/callback',
  // });

  // React.useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { access_token } = response.params;
  //     handleGoogleLogin(access_token);
  //   }
  // // }, [response]);

  // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  //   clientId: Platform.select({
  //     ios: '537502668452-6r7i03nd3470lq0s42p70dvm956ge624.apps.googleusercontent.com',
  //     android: '537502668452-6r7i03nd3470lq0s42p70dvm956ge624.apps.googleusercontent.com',
  //     // For web, use your web client ID
  //     web: '537502668452-6r7i03nd3470lq0s42p70dvm956ge624.apps.googleusercontent.com',
  //   }),
  //   redirectUri: 'http://appchodocutest.ddns.net:3000/auth/google/callback', // Ensure this matches your configuration
  // });

  // React.useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { id_token } = response.params;
  //     // Handle the authentication result here
  //     Alert.alert('Success', `ID Token: ${id_token}`);
  //   }
  // }, [response]);

  // return (
  //   <Button
  //     title="Login with Google"
  //     onPress={() => {
  //       promptAsync();
  //     }}
  //   />
  // );


  // const handleGoogleLogin = async (accessToken) => {
  //   try {
  //     const response = await axios.post(`${config.apiBaseURL}/user/google-login`, {
  //       accessToken,
  //     });

  //     const { token, role, user } = response.data;
  //     await storeToken(token, role, user._id);
  //     navigation.navigate(role === 'admin' ? 'Admin' : 'User');
  //   } catch (error) {
  //     console.error('Google login error:', error);
  //     Alert.alert('Error', 'Google login failed');
  //   }
  // };
  
const handleLogin = async () => {
  try {
      const userData = {
          identifier: identifier,
          password: password
      };
      console.log('Logging in with:', userData);
      const apiURL = `${config.apiBaseURL}/user/login`;
      const response = await axios.post(apiURL, userData);

      console.log('API URL:', apiURL);

      // const response = await axios.post(apiURL, userData, { withCredentials: true });

      // const response = await axios.post(`${config.apiBaseURL}/user/login`, userData);
      const { token, role, user } = response.data; // Lấy user từ response data
      // const userId = user._id;

      await storeToken(token, role, user._id);

      // console.log('Login successful! Role:', role, 'UserId:', userId, 'Token:', token); // Hiển thị role, token và userId trong terminal

      navigation.navigate(role === 'admin' ? 'Admin' : 'User'); // Navigation dựa trên role
  } catch (error) {
      console.error("Login error:", error);
      Alert.alert('Error rui son oi', error.message);
  }
};

const handleForgotPassword = () => {
  navigation.navigate('RegisterUser')
  console.log('Forgot password pressed');
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
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                      <Text style={styles.forgotPassword}>Forgot?</Text>
                </TouchableOpacity>
              </View>


              <CustomButton label={"Login"} onPress={handleLogin} />


     
      <Text style={{textAlign: 'center', color: '#888', marginBottom: 30}}>
          Or, login with ...
        </Text>


   <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30}}>
              <TouchableOpacity
                onPress={() => promptAsync()}
                style={{borderColor: '#ddd', borderWidth: 2, borderRadius: 10, paddingHorizontal: 60, paddingVertical: 10}}>
                <MaterialCommunityIcons name="google" size={30} color="#EA7575" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {}}
                style={{borderColor: '#ddd', borderWidth: 2, borderRadius: 10, paddingHorizontal: 60, paddingVertical: 10}}>
                <MaterialCommunityIcons name="facebook" size={30} color="#75ABEA" />
              </TouchableOpacity>
            </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
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