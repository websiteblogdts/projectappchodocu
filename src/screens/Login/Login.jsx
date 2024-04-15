import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

function LoginScreen({ navigation }) {
  const [identifier, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const userData = {
      identifier: identifier,
      password: password
    };
    console.log("Registration data:", userData);
    axios.post('http://appchodocu.ddns.net:3000/user/login', userData)
      .then(res => {
        // Handle successful login
        navigation.navigate('Root'); // Navigate to the home screen after successful login
      })
      .catch(error => {
        // Handle login error
        console.error("Login error:", error);
        alert("Invalid email or password. Please try again.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or SDT"
        value={identifier}
        onChangeText={text => setEmailOrPhone(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterUser')}>
        <Text style={styles.registerText}>Don't have an account? Register here</Text>
      </TouchableOpacity>
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
});

export default LoginScreen;
