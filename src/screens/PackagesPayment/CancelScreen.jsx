import React, { useEffect } from 'react';
import { View, Text, Button, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CancelScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Hàm xử lý khi deep link được bắt
    const handleDeepLink = (event) => {
      const url = event.url;

      if (url.includes('package/cancel')) {
        // Chuyển hướng tới màn hình CancelScreen
        navigation.navigate('CancelScreen');
      }
    };

    // Lắng nghe sự kiện khi deep link được mở
    Linking.addEventListener('url', handleDeepLink);

    // Kiểm tra nếu ứng dụng được mở thông qua deep link
    Linking.getInitialURL().then((url) => {
      if (url && url.includes('package/cancel')) {
        navigation.navigate('CancelScreen');
      }
    });

    return () => {
      // Xóa sự kiện khi component unmount
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Payment was cancelled!</Text>
      <Button title="Go Home" onPress={() => navigation.navigate('HomeStack')} />
    </View>
  );
};

export default CancelScreen;
