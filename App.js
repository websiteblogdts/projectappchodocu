import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login/Login';
import ProductDetailUser from './src/screens/Product/ProductDetailUser';
import ListUser from './src/screens/Admin/ListUser';
import UserDetail from './src/screens/Admin/UserDetail';
import ViewPosts from './src/screens/Admin/ViewPosts';
import ProductDetail from './src/screens/Product/ProductDetail';
import ProductList from './src/screens/Product/ProductList';
import EditProduct from './src/screens/Product/EditProduct';
import AddProduct from './src/screens/Product/AddProduct';
import UserProfileScreen from './src/screens/User/UserProfileScreen';
import RegisterUser from './src/screens/Register/RegisterUser';
import ProductListByUser from './src/screens/Product/ProductListByUser';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Màn hình Home Stack khai báo gì thì dùng được cái đó, khai báo mới hiển thị được.
//dành cho user
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: true ,title: 'View Product List'}} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: true ,title: 'View Product List'}}/>
      <Stack.Screen name="EditProduct" component={EditProduct} />
      <Stack.Screen name="ProductDetailUser" component={ProductDetailUser} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator cho user
function BottomTabsForUser() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeStack') {
            iconName = focused ? 'house' : 'house';
          }
          if (route.name === 'ProductList') {
            iconName = focused ? 'basket-shopping' : 'basket-shopping';
          } else if (route.name === 'AddProduct') {
            iconName = focused ? 'plus' : 'plus';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'Chat' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'UserProfileScreen') {
            iconName = focused ? 'circle-user' : 'circle-user';
          }else if (route.name === 'ProductListByUser') {
            iconName = focused ? 'user' : 'user';
          }

          return <FontAwesome6 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
    
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="AddProduct" component={AddProduct} />
      <Tab.Screen name="UserProfileScreen" component={UserProfileScreen} />
      <Tab.Screen name="ProductListByUser" component={ProductListByUser}  options={{ title: 'View Product By User'}} />
    </Tab.Navigator>
  );
}

function HomeStackAdmin() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ViewPosts" component={ViewPosts} options={{ headerShown: false }} />
      <Stack.Screen name="ListUser" component={ListUser} />
      <Stack.Screen name="UserDetail" component={UserDetail} />
      <Stack.Screen name="ProductDetailUser" component={ProductDetailUser} />
    </Stack.Navigator>
  );
}

// tạo thêm BottomTabs cho admin nếu đăng nhập check là admin 
function BottomTabsForAdmin() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'house' : 'house';
          } else if (route.name === 'ListUser') {
            iconName = focused ? 'user-pen' : 'user-pen';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'Chat' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'UserProfileScreen') {
            iconName = focused ? '' : '';
          }else if (route.name === 'RegisterUser') {
            iconName = focused ? '' : '';
          }

          return <FontAwesome6 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStackAdmin} options={{ headerShown: false,  title: 'Quản Lý Bài Đăng' }}/>
      <Tab.Screen name="ListUser" component={ListUser} options={{ title: 'View User List' }} /> 
      <Tab.Screen name="RegisterUser" component={RegisterUser} />
      <Tab.Screen name="UserProfileScreen" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Root" component={BottomTabsForUser} options={{ headerShown: false }} />
        <Stack.Screen name="Admin" component={BottomTabsForAdmin} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterUser" component={RegisterUser} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
