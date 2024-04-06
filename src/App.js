import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductDetail from './screens/Product/ProductDetail';
import ProductList from './screens/Product/ProductList';
import UpdateProduct from './screens/Product/EditProduct';
import AddProduct from './screens/Product/AddProduct';
import User from './screens/User/User';
import Profile from './screens/User/Profile';
// import Home from './screens/Home/Home';
// import Chat from './Screens/Chat/Chat';

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
          } else if (route.name === 'User') {
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
      <Tab.Screen name="User" component={User} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Root" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
