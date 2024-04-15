import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';

function RegisterPage({props}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [nameVerify, setNameVerify] = useState(false);
    const [mobileVerify, setMobileVerify] = useState(false);
    const [emailVerify, setEmailVerify] = useState(false);
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = () => {
        // Add logic to send registration data to backend
        if (nameVerify && mobileVerify && emailVerify && passwordVerify) {
            // All fields are valid, send registration data to backend
            console.log("All fields are valid. Sending registration data to backend...");
            const userData = {
                name: name,
                email: email,
                mobile: mobile,
                password: password
            };
            axios.post('http://appchodocu.ddns.net:3000/auth/register', userData)
            .then(res => console.log(res.data))
            .catch(e => console.log(e));
        } else {
            // Not all fields are valid, display error message or handle accordingly
            console.log("Some fields are invalid. Please check your input.");
        }
    }

    function handlePassword(text) {
        setPassword(text);
        // Add password validation logic here
        setPasswordVerify(text.length >= 6);
    }

    function handleMobile(text) {
        setMobile(text);
        // Add mobile validation logic here
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
                placeholder="Mobile"
                value={mobile}
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

export default RegisterPage;