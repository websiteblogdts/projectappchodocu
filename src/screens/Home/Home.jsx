import { View, Text } from 'react-native';

function Home(props) {
    console.log(props);
  return (
    
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen
        tại đây tôi sẽ làm darkboard
      </Text>
    </View>
    
  );
}

export default Home;