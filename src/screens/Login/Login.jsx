import React, { useState } from 'react';
import { View, Text, Image,Alert, ScrollView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../components/CustomButton';
import config from '../../config/config';
// console.log(process.env.REACT_APP_API_BASE_URL)
// import CookieManager from '@react-native-cookies/cookies';
import styles from '../../components/Login';
import { storeToken } from '../../store/Userlogin'; // Import saveToken

function LoginScreen({ navigation }) {
  const [identifier, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async () => {
  try {
      const userData = {
          identifier: identifier,
          password: password
      };
      console.log('Logging in with:', userData);
      const apiURL = `${config.apiBaseURL}/user/login`;
      console.log('API URL:', apiURL);

      // const response = await axios.post(apiURL, userData, { withCredentials: true });

      const response = await axios.post(`${config.apiBaseURL}/user/login`, userData);
      const { token, role, user } = response.data; // Lấy user từ response data
      // const userId = user._id;

      await storeToken(token, role, user._id);

      // console.log('Login successful! Role:', role, 'UserId:', userId, 'Token:', token); // Hiển thị role, token và userId trong terminal

      // await AsyncStorage.setItem('userToken', token);
      // await AsyncStorage.setItem('userRole', role); // Lưu role vào AsyncStorage
      // await AsyncStorage.setItem('userId', userId); // Lưu userId vào AsyncStorage

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

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 60,
              paddingVertical: 10,
            }}>
        <MaterialCommunityIcons name="google" 
        title="google" size={30} color="#EA7575"   onPress={() => {}} />

          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 60,
              paddingVertical: 10,
            }}>
        <MaterialCommunityIcons name="facebook" 
        title="google" size={30} color="#75ABEA"   onPress={() => {}} />
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