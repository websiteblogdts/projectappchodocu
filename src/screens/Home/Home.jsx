import { View, Text, Button } from 'react-native';

function Home(props) {
    console.log(props);
  return (
    
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>

      <Button 
      title="Profile" onPress={() => props.navigation.navigate('Profile')}
      />
 <Button 
      title="CreateProduct" onPress={() => props.navigation.navigate('CreateProduct')}
      />
      <Button 
      title="Tên nút này là show product" onPress={() => props.navigation.navigate('Đây là danh sách product')}
      />
    </View>
    
  );
}

export default Home;