import React, { useState, useEffect } from 'react';
import { View, Alert, TextInput, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import config from '../../config/config';
import OtpModalStyles from '../../components/OtpModalStyles'; // Đảm bảo đường dẫn chính xác

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [otpExpired, setOtpExpired] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        let timer;
        if (countdown > 0 && otpModalVisible) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0 && otpModalVisible) {
            setOtpExpired(true); // Đánh dấu OTP đã hết hạn
        }
        return () => clearInterval(timer);
    }, [countdown, otpModalVisible]);

    const handleRequestOtp = async () => {
        // Kiểm tra độ dài mật khẩu
    if (newPassword.length < 6) {
        Alert.alert('Thông báo', 'Mật khẩu phải có ít nhất 6 ký tự.'); // Thông báo nếu mật khẩu không đủ dài
        return; // Dừng lại nếu mật khẩu không hợp lệ
    }
        try {
            const requestData = { email };
            // console.log("Gửi dữ liệu đến API:", requestData); // Log thông tin gửi đến API
            const res = await axios.post(`${config.apiBaseURL}/otp/send-otp-after`, requestData);
            startCountdown();
            setOtpModalVisible(true);
            Alert.alert(res.data.message);
        } catch (error) {
            // Hiển thị thông báo lỗi từ BE
            if (error.response && error.response.data && error.response.data.error) {
                Alert.alert('Thông báo', error.response.data.error); // Thông báo từ backend
            } else {
                // console.error("Error requesting OTP:", error);
                Alert.alert('Thông báo', 'Có lỗi xảy ra. Vui lòng thử lại.' ,error); // Thông báo lỗi chung
            }
        }
    };
    
    const handleVerifyOtpAndResetPassword = async () => {
        try {
            const res = await axios.post(`${config.apiBaseURL}/user/forgetpassword`, { email, newPassword, otpCode });
            Alert.alert(res.data.message);
            navigation.navigate('Login'); // Chuyển hướng đến màn hình đăng nhập sau khi đặt lại mật khẩu thành công
        } catch (error) {
            if (error && error.response && error.response.data && error.response.data.error) {
                Alert.alert(error.response.data.error);
            } else {
                console.error("Error:", error);
            }
        }
    };

    const startCountdown = () => {
        setCountdown(30); // Reset countdown to 30 seconds
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#888"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={handleRequestOtp}>
                <Text style={styles.buttonText}>Request OTP</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={otpModalVisible}
                onRequestClose={() => setOtpModalVisible(false)}
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
                        <Text style={OtpModalStyles.countdownText}>Còn lại: {countdown} giây</Text>
                        {otpExpired && <Text style={OtpModalStyles.countdownText}>Mã OTP đã hết hạn!</Text>}
                        <TouchableOpacity style={OtpModalStyles.button} onPress={handleVerifyOtpAndResetPassword}>
                            <Text style={OtpModalStyles.buttonText}>Đặt lại mật khẩu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleRequestOtp}>
                            <Text style={{ textAlign: 'center', marginTop: 20 }}>Gửi lại mã OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3B3B3B',
    },
    input: {
        color: 'white',
        height: 40,
        width: 300,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ForgetPassword;
