import React from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import config from '../../config/config';
import { useEffect } from 'react';
import { Linking } from 'react-native';

const PayPalPayment = ({ route }) => {
  const { approvalUrl, orderId } = route.params;
  const navigation = useNavigation();
const response = response;
  const onNavigationStateChange = async (navState) => {
    const { url, loading } = navState;
    console.log('Current URL:', url); // Log the current URL

    if (!loading) {
      if (url.includes('payment/success')) {
        console.log('Payment success URL detected');
        await capturePayment(orderId); // Capture payment and navigate to profile
      } else if (url.includes('payment/cancel')) {
        console.log('Payment cancel URL detected');
        navigation.navigate('CancelScreen'); // Navigate to cancel screen on cancellation
      }
    }
  };

  const handleNavigationStateChange = (navState) => {
    if (response && response.type === 'success') {
      console.log('Google login response:', response);

      navigation.navigate('SuccessScreen');
    } else if (navState.url.includes('exp://127.0.0.1:8081/package/cancel')) {
      // Khi thanh toán bị hủy, chuyển hướng đến trang cancel
      navigation.navigate('CancelScreen');
    }
  };

  return (
    <WebView
      source={{ uri: approvalUrl }}
      // onNavigationStateChange={onNavigationStateChange}
      // onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default PayPalPayment;
