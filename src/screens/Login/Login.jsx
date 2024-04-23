import React, { useState } from 'react';
import { View, Text,SafeAreaView, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';

function LoginScreen({ navigation }) {
  const [identifier, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async () => {
  try {
      const userData = {
          identifier: identifier,
          password: password
      };
      const response = await axios.post('http://appchodocu.ddns.net:3000/user/login', userData);
      const { token, role } = response.data; // Lấy cả role từ response data

      console.log('Login successful! Role:', role, 'Token:', token); // Hiển thị role và token trong terminal

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', role); // Lưu role vào AsyncStorage

      navigation.navigate(role === 'admin' ? 'Admin' : 'Root'); // Navigation dựa trên role
  } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password. Please try again.");
  }
};

const handleForgotPassword = () => {
  navigation.navigate('RegisterUser')
  console.log('Forgot password pressed');
};


  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      
        <View style={styles.logoContainer}>
        <Image
          source={{ uri: "https://res.cloudinary.com/dvm8fnczy/image/upload/v1713510313/vrzu6ljfyvevdfzatyzf.jpg" }}
          style={styles.logo}
        />
        </View>

        <View style={{paddingHorizontal: 25}}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Login
        </Text>

        <View style={styles.inputContainer}>
        <MaterialIcons
          name="alternate-email"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email or SDT"
          value={identifier}
          onChangeText={text => setEmailOrPhone(text)}
        />
         </View>   


<View style={styles.inputContainer}>
  <MaterialIcons
    name="lock"
    size={20}
    color="#666"
    style={styles.icon}
  />
  <TextInput
    style={styles.input}
    placeholder="Password"
    value={password}
    onChangeText={text => setPassword(text)}
    secureTextEntry={true}
  />
  <TouchableOpacity onPress={() => navigation.navigate('RegisterUser')}>
        <Text style={styles.forgotPassword}>Forgot?</Text>
  </TouchableOpacity>
</View>


 <CustomButton label={"Login"} onPress={handleLogin} />


     
      <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
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
              <Image height={24} width={24}
          source={{ uri: "https://banner2.cleanpng.com/20180423/gkw/kisspng-google-logo-logo-logo-5ade7dc753b015.9317679115245306313428.jpg" }}
        />
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
<Image height={24} width={24}
          source={{ uri: "https://w7.pngwing.com/pngs/480/615/png-transparent-facebook-logo-facebook-computer-icons-desktop-s-icon-facebook-blue-text-trademark.png" }}
          
        />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
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