import React from 'react';
import { View, Text, Button } from 'react-native';

const SuccessScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Payment was successful!</Text>
      <Button title="Go to Profile" onPress={() => navigation.navigate('UserProfileScreen')} />
    </View>
  );
};

export default SuccessScreen;
