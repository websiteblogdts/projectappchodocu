import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';

const SuccessScreen = ({ navigation, route }) => {
  const { token, payerId } = route.params; // Nhận token và payerId từ params

  useEffect(() => {
    // Hàm gọi API capture-payment
    const capturePayment = async () => {
      try {
        const response = await fetch(`http://appchodocutest.ddns.net:3000/payments/capture-payment?token=${token}&PayerID=${payerId}`, {
          method: 'GET', // Hoặc 'POST' nếu API yêu cầu
        });
        const data = await response.json();
        if (response.ok) {
          Alert.alert('Success', 'Payment captured successfully!');
          console.log('Capture Payment Result:', data); // Ghi log kết quả
        } else {
          Alert.alert('Error', 'Payment capture failed!');
          console.error('Capture Payment Error:', data);
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred during payment capture.');
        console.error('Error:', error);
      }
    };

    // Gọi hàm capturePayment khi trang được tải
    capturePayment();
  }, [token, payerId]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Payment was successful!</Text>
      <Button title="Go to Profile" onPress={() => navigation.navigate('UserProfileScreen')} />
    </View>
  );
};

export default SuccessScreen;
