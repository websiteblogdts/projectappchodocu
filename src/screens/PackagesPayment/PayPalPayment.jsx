import React, { useEffect } from 'react';
import { View, Alert, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';

const PayPalPaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId, approvalUrl } = route.params;

  const handleNavigationStateChange = async (navState) => {
    if (navState.url.includes('success')) {
      try {
        const response = await fetch(`${config.apiBaseURL}/payments/capture-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
          Alert.alert('Payment Successful', 'Your payment was successful!');
          navigation.navigate('UserProfileScreen');
        } else {
          Alert.alert('Payment Error', data.error || 'Something went wrong');
        }
      } catch (error) {
        console.error('Error capturing payment:', error);
        Alert.alert('Payment Error', 'Something went wrong');
      }
    } else if (navState.url.includes('cancel')) {
      Alert.alert('Payment Cancelled', 'Your payment was cancelled.');
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: approvalUrl }}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </View>
  );
};

export default PayPalPaymentScreen;
