import React, { useState } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function RegisterUser({props}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone_number, setPhonenumber] = useState('');
    const [nameVerify, setNameVerify] = useState(false);
    const [mobileVerify, setMobileVerify] = useState(false);
    const [emailVerify, setEmailVerify] = useState(false);
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const handleRegister = () => {
        // Add logic to send registration data to backend
        if (nameVerify && mobileVerify && emailVerify && passwordVerify) {
            // All fields are valid, send registration data to backend
            console.log("All fields are valid. Sending registration data to backend...");
            const avatar_image = 'https://static.vecteezy.com/system/resources/previews/019/494/983/original/muscle-man-boy-avatar-user-person-people-cartoon-cute-colored-outline-sticker-retro-style-vector.jpg';

            const userData = {
                name: name,
                email: email,
                phone_number: phone_number,
                password: password,
                avatar_image: avatar_image
            };
            
            console.log("Registration data:", userData);
            axios.post('http://appchodocu.ddns.net:3000/user/register', userData)
            .then(res => {
                if (res && res.data && res.data.message) {
                    Alert.alert(res.data.message);
                    navigation.navigate('Login');
                } else {
                    console.error("Invalid response format:", res);
                    // Xử lý khi phản hồi không hợp lệ
                }
            })
            .catch(error => {
                if (error && error.response && error.response.data && error.response.data.error) {
                    Alert.alert(error.response.data.error);
                } else {
                    console.error("Error:", error);
                    // Xử lý khi có lỗi xảy ra
                }
            });
        } else {
            // Not all fields are valid, display error message or handle accordingly
            alert("Some fields are invalid. Please check your input.");
        }
    }
    

    function handlePassword(text) {
        setPassword(text);
        // Add password validation logic here
        setPasswordVerify(text.length >= 6);
    }

    function handleMobile(text) {
        setPhonenumber(text);
        setMobileVerify(text.length === 10 && /^\d+$/.test(text));
    }

    function handleName(text) {
        setName(text);
        setNameVerify(text.length > 1);
    }
    
    function handleEmail(text) {
        setEmail(text);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailVerify(emailRegex.test(text));
    }
    

return (
    <View style={styles.container}>
      <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={handleName}
      />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={handleEmail} 
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => handlePassword(text)}
                secureTextEntry={!showPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Phonenumber"
                value={phone_number}
                onChangeText={(text) => handleMobile(text)}
                keyboardType="numeric"
            />
            <TouchableOpacity  style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
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
    input: {
        height: 40,
        width: 300,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
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
        fontWeight: 'bold',
    },
});

export default RegisterUser;
