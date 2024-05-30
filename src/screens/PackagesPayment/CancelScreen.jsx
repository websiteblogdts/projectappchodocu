import React from 'react';
import { View, Text, Button } from 'react-native';

const CancelScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Payment was cancelled!</Text>
      <Button title="Go Home" onPress={() => navigation.navigate('HomeStack')} />
    </View>
  );
};

export default CancelScreen;
