import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TextInput,Alert, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../components/CustomButton';
import config from '../../config/config';
console.log(process.env.REACT_APP_API_BASE_URL)

function LoginScreen({ navigation }) {
  const [identifier, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async () => {
  try {
      const userData = {
          identifier: identifier,
          password: password
      };
    
      const response = await axios.post(`${config.apiBaseURL}/user/login`, userData);
      const { token, role } = response.data; // Lấy cả role từ response data

      console.log('Login successful! Role:', role, 'Token:', token); // Hiển thị role và token trong terminal

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', role); // Lưu role vào AsyncStorage

      navigation.navigate(role === 'admin' ? 'Admin' : 'Root'); // Navigation dựa trên role
  } catch (error) {
    Alert.alert('Error rui son oi', error.response.data.error);
      // console.error("Login error:", error.response.data.error);
      // alert("Invalid email or password. Please try again.");
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
                <TouchableOpacity onPress={() => navigation.navigate('RegisterUser')}>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "gray",
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color:'white'
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },

  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  registerText: {
    marginTop: 20,
    color: 'blue',
  },
  logoContainer: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 220,
    borderRadius: 60,
  },
  loginText: {
    // width: 250,
    // height: 220,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color:'blue'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    
  },
  input: {
    color:'white',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 5, // Điều chỉnh khoảng cách giữa icon và TextInput
  },
  forgotPassword: {
    color: '#AD40AF',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
  }
});
export default LoginScreen;