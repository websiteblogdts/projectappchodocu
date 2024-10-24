// import React, { useState ,useEffect } from 'react';
// import { View, Alert, TextInput,Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
// import config from '../../config/config';
// import OtpModalStyles from '../../components/OtpModalStyles'; // Đảm bảo đường dẫn chính xác

// function RegisterUser({props}){
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [name, setName] = useState('');
//     const [phone_number, setPhonenumber] = useState('');
//     const [nameVerify, setNameVerify] = useState(false);
//     const [mobileVerify, setMobileVerify] = useState(false);
//     const [emailVerify, setEmailVerify] = useState(false);
//     const [passwordVerify, setPasswordVerify] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     const [otpModalVisible, setOtpModalVisible] = useState(false);
//     const [otpExpired, setOtpExpired] = useState(false);
//     const [otpCode, setOtpCode] = useState('');
//     const [countdown, setCountdown] = useState(30);
//     const navigation = useNavigation();
//     useEffect(() => {
//         let timer;
//         if (countdown > 0 && otpModalVisible) {
//             timer = setInterval(() => {
//                 setCountdown(prev => prev - 1);
//             }, 1000);
//         } else if (countdown === 0 && otpModalVisible) {
//             setOtpExpired(true); // Đánh dấu OTP đã hết hạn
//         }
//         return () => clearInterval(timer);
//     }, [countdown, otpModalVisible]);

//     const handleCloseModal = () => {
//         setOtpModalVisible(false);
//         setOtpCode('');
//       };

//       const handleSkipOtp = async () => {
//         try {
//           Alert.alert('Account register Success', 'Bạn đã bỏ qua xác minh otp, có thể xác minh lại trong trang profile để sử dụng nhiều tính năng hơn');
//           navigation.navigate('Login');

//         } catch (error) {
//           console.error('Failed', error);
//         }
//       };
//     const handleRequestOtp = async () => {
//         try {
//           const res = await axios.post(`${config.apiBaseURL}/otp/send-otp-after`, { email });
//           // Alert.alert(res.data.message);
//           startCountdown();
//         //   setOtpModalVisible(true);
//         } catch (error) {
//           console.error("Error requesting OTP:", error);
//         }
//       };
      
//     const handleVerifyOtp = () => {
//     //     console.log("Email:", email);
//     // console.log("OTP Code:", otpCode);
//         // Replace this with your actual OTP verification API call
//         axios.post(`${config.apiBaseURL}/otp/verify-otp`, { email, otpCode })
//             .then(res => {
//                 if (res && res.data && res.data.message) {
//                     Alert.alert(res.data.message);
//                     navigation.navigate('Login');
//                 }
//             })
//             .catch(error => {
//                 if (error && error.response && error.response.data && error.response.data.error) {
//                     Alert.alert(error.response.data.error);
//                 } else {
//                     console.error("Error:", error);
//                 }
//             });
//     };
    
//     const handleRegister = () => {
//         if (nameVerify && mobileVerify && emailVerify && passwordVerify) {
//             const avatar_image = 'https://static.vecteezy.com/system/resources/previews/019/494/983/original/muscle-man-boy-avatar-user-person-people-cartoon-cute-colored-outline-sticker-retro-style-vector.jpg';
    
//             const userData = {
//                 name: name,
//                 email: email,
//                 phone_number: phone_number,
//                 password: password,
//                 avatar_image: avatar_image
//             };
//             axios.post(`${config.apiBaseURL}/user/register`, userData)
//             .then(res => {
//                 if (res && res.data && res.data.message) {
//                     Alert.alert(res.data.message);
//                     setOtpModalVisible(true); // Hiển thị modal để người dùng nhập OTP
//                     startCountdown(); // Bắt đầu đếm ngược cho OTP
//                 }
//             })
//             .catch(error => {
//                 if (error && error.response && error.response.data && error.response.data.error) {
//                     Alert.alert(error.response.data.error);
//                 } else {
//                     console.error("Error:", error);
//                 }
//             });
//         } else {
//             alert("Some fields are invalid. Please check your input.");
//         }
//     }
    
  

    
//     const startCountdown = () => {
//         setCountdown(30); // Reset countdown to 30 seconds
//     };

//     function handlePassword(text) {
//         setPassword(text);
//         // Add password validation logic here
//         setPasswordVerify(text.length >= 6);
//     }

//     function handleMobile(text) {
//         setPhonenumber(text);
//         setMobileVerify(text.length === 10 && /^\d+$/.test(text));
//     }

//     function handleName(text) {
//         setName(text);
//         setNameVerify(text.length > 1);
//     }
    
//     function handleEmail(text) {
//         setEmail(text);
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         setEmailVerify(emailRegex.test(text));
//     }
    

// return (
//     <View style={styles.container}>
//       <TextInput
//                 style={styles.input}
//                 placeholder="Name"
//                 placeholderTextColor="#888"
//                 value={name}
//                 onChangeText={handleName}
//       />
//             <TextInput
//                 style={styles.input}
//                 placeholder="Email"
//                 placeholderTextColor="#888"
//                 value={email}
//                 onChangeText={handleEmail} 
//             />

//             <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 placeholderTextColor="#888"
//                 value={password}
//                 onChangeText={(text) => handlePassword(text)}
//                 secureTextEntry={!showPassword}
//             />
//             <TextInput
//                 style={styles.input}
//                 placeholder="Phonenumber"
//                 placeholderTextColor="#888"
//                 value={phone_number}
//                 onChangeText={(text) => handleMobile(text)}
//                 keyboardType="numeric"
//             />
//             <TouchableOpacity  style={styles.button} onPress={handleRegister}>
//             <Text style={styles.buttonText}>Register</Text>
//             </TouchableOpacity>

//              {/* <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={otpModalVisible}
//                 onRequestClose={() => setOtpModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <Text style={styles.modalTitle}>Enter OTP</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="OTP Code"
//                         placeholderTextColor="#888"
//                         value={otpCode}
//                         onChangeText={setOtpCode}
//                         keyboardType="numeric"
//                     />
//                         <Text style={styles.countdownText}>Time left: {countdown}s</Text>
//                     {otpExpired && (
//                         <Text style={styles.alertText}>
//                             OTP expired. You can still proceed without it but some features will be limited.
//                         </Text>
//                     )}
//                     <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
//                         <Text style={styles.buttonText}>Verify OTP</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.button} onPress={handleSkipOtp}>
//                         <Text style={styles.buttonText}>Skip OTP</Text>
//                     </TouchableOpacity>
//                 </View>
//             </Modal> */}

//                 <Modal
//                         animationType="slide"
//                         transparent={true}
//                         visible={otpModalVisible}
//                         // onRequestClose={handleCloseModal}
//                         onRequestClose={() => setOtpModalVisible(false)}

//                     >
//                         <View style={OtpModalStyles.modalContainer}>
//                         <View style={OtpModalStyles.modalContent}>
//                             <Text style={OtpModalStyles.modalHeader}>Nhập mã OTP</Text>
//                             <TextInput
//                             style={OtpModalStyles.input}
//                             placeholder="Mã OTP"
//                             keyboardType="numeric"
//                             value={otpCode}
//                             onChangeText={setOtpCode}
//                             />
//                             <TouchableOpacity style={OtpModalStyles.button} onPress={handleVerifyOtp}>
//                             <Text style={OtpModalStyles.buttonText}>Xác minh OTP</Text>
//                             </TouchableOpacity>
//                             {otpExpired && <Text style={OtpModalStyles.countdownText}>Mã OTP đã hết hạn!</Text>}
//                             {countdown > 0 && <Text style={OtpModalStyles.countdownText}>Còn lại: {countdown} giây</Text>}
//                             <TouchableOpacity onPress={handleRequestOtp}>
//                             <Text style={{ textAlign: 'center', marginTop: 20 }}>Gửi lại mã OTP</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={handleSkipOtp}>
//                             <Text style={{ textAlign: 'center', marginTop: 10 }}>Skip OTP</Text>
//                             </TouchableOpacity>
//                         </View>
//                         </View>
//                     </Modal>

//         </View>
//     );
// }
// const styles = StyleSheet.create({
//        container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#3B3B3B',
//     },
//     input: {
//         color: 'white',
//         height: 40,
//         width: 300,
//         borderColor: 'gray',
//         borderWidth: 1,
//         borderRadius: 5,
//         marginBottom: 10,
//         paddingHorizontal: 10,
//     },
//     button: {
//         backgroundColor: 'gray',
//         padding: 10,
//         borderRadius: 5,
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.8)',
//         padding: 20,
//     },
//     modalTitle: {
//         color: 'white',
//         fontSize: 20,
//         marginBottom: 10,
//     },
//     countdownText: {
//         color: 'white',
//         marginVertical: 10,
//     },
// });

// export default RegisterUser;
