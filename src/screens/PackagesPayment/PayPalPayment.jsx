import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';

// Trong component PayPalPayment

const PayPalPayment = ({ navigation, route }) => {
  const { approvalUrl } = route.params;
  const [paymentStatus, setPaymentStatus] = useState(null);

  const onNavigationStateChange = (navState) => {
    const { url, loading } = navState;
    if (!loading) {
      if (url.includes('payment/success')) {
        setPaymentStatus('success');
        capturePayment(route.params.orderId); // Gọi hàm capturePayment khi thanh toán thành công
      } else if (url.includes('payment/cancel')) {
        setPaymentStatus('cancel');
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
    } catch (error) {
      console.error('Error capturing payment:', error);
    }
  };
  const handleContinueToReviewOrder = async () => {
    try {
      const response = await fetch(`${config.apiBaseURL}/payments/capture-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: route.params.orderId }),
      });

      const data = await response.json();
      console.log('Capture payment response:', data);
      navigation.navigate('SuccessScreen');
    } catch (error) {
      console.error('Error capturing payment:', error);
    }
  };
  const injectedJavaScript = `
  document.querySelector('[data-testid="continue-to-review-order"]').onclick = () => {
    console.log('Continue to review order button clicked');
    window.ReactNativeWebView.postMessage('continueToReviewOrderClicked');
    return false; // Ngăn chặn hành động mặc định của nút
  };
`;
  return (
    <WebView
    source={{ uri: approvalUrl }}
    onNavigationStateChange={onNavigationStateChange}
    javaScriptEnabled={true}
    injectedJavaScript={injectedJavaScript}
    onMessage={(event) => {
      if (event.nativeEvent.data === 'continueToReviewOrderClicked') {
        console.log('Continue to review order event received');
        handleContinueToReviewOrder();
      }
    }}
  />
  );
};

export default PayPalPayment;
