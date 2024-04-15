import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login/Login';

import ProductDetail from './src/screens/Product/ProductDetail';
import ProductList from './src/screens/Product/ProductList';
import UpdateProduct from './src/screens/Product/EditProduct';
import AddProduct from './src/screens/Product/AddProduct';
import UserProfileScreen from './src/screens/User/UserProfileScreen';
import Profile from './src/screens/User/Profile';
import RegisterUser from './src/screens/Register/RegisterUser';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Màn hình Home Stack
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }} />
      {/* <Stack.Screen name="Home" component={Home} /> */}
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="UpdateProduct" component={UpdateProduct} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'basket-shopping' : 'basket-shopping';
          } else if (route.name === 'AddProduct') {
            iconName = focused ? 'plus' : 'plus';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'Chat' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'UserProfileScreen') {
            iconName = focused ? 'user' : 'user';
          }else if (route.name === 'RegisterUser') {
            iconName = focused ? 'user' : 'user';
          }

          return <FontAwesome6 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="AddProduct" component={AddProduct} />
      {/* <Tab.Screen name="Chat" component={ChatMess} /> */}
      <Tab.Screen name="UserProfileScreen" component={UserProfileScreen} />
      <Tab.Screen name="RegisterUser" component={RegisterUser} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Root" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} />        
        <Stack.Screen name="RegisterUser" component={RegisterUser} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
