import React from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import config from '../../config/config';

const PayPalPayment = ({ route }) => {
  const { approvalUrl, orderId } = route.params;
  const navigation = useNavigation();

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

  const capturePayment = async (orderId) => {
    try {
      const response = await fetch(`${config.apiBaseURL}/payments/capture-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();
      console.log('Capture payment response:', data);

      if (data.success) {
        navigation.navigate('UserProfileScreen'); // Navigate to user profile on success
      } else {
        console.error('Payment capture failed:', data.error);
        // Optionally handle the error by showing an alert or navigating to an error screen
      }
    } catch (error) {
      console.error('Error capturing payment:', error);
      // Optionally handle the error by showing an alert or navigating to an error screen
    }
  };

  return (
    <WebView
      source={{ uri: approvalUrl }}
      onNavigationStateChange={onNavigationStateChange}
    />
  );
};

export default PayPalPayment;
