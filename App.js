import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';

import Home from './src/screens/Home/Home';
import LoginScreen from './src/screens/Login/Login';
import ProductDetailUser from './src/screens/Product/ProductDetailUser';
import ListUser from './src/screens/Admin/ListUser';
import UserDetail from './src/screens/Admin/UserDetail';
import ViewPostsMain from './src/screens/Admin/ViewPostsMain';
import ProductDetail from './src/screens/Product/ProductDetail';
import ProductList from './src/screens/Product/ProductList';
import EditProduct from './src/screens/Product/EditProduct';
import AddProduct from './src/screens/Product/AddProduct';
import UserProfileScreen from './src/screens/User/UserProfileScreen';
import RegisterUser from './src/screens/Register/RegisterUser';
import ProductListByUser from './src/screens/Product/ProductListByUser';
import CategoryManager from './src/screens/Admin/CategoryManager';
import ListMess from './src/screens/Chat/ListMess';
import MessagesScreen from './src/screens/Chat/MessagesScreen';

import PackageScreen from './src/screens/PackagesPayment/PackageScreen';
import PayPalPayment from './src/screens/PackagesPayment/PayPalPayment';
import SuccessScreen from './src/screens/PackagesPayment/SuccessScreen';
import CancelScreen from './src/screens/PackagesPayment/CancelScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const defaultHeaderOptions = {
  headerStyle: {
    backgroundColor: '#3B3B3B',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={defaultHeaderOptions}>
    <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: true, title: 'View Product List' }} />
    <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: true, title: 'View Product List' }} />
    <Stack.Screen name="MessagesScreen" component={MessagesScreen} options={{ headerShown: true }} />
  </Stack.Navigator>
);

const CreateProduct = () => (
  <Stack.Navigator screenOptions={defaultHeaderOptions}>
    <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerShown: true }} />
  </Stack.Navigator>
);

const Chat = () => (
  <Stack.Navigator screenOptions={defaultHeaderOptions}>
    <Stack.Screen name="ListMess" component={ListMess} options={{ headerShown: true }} />
    <Stack.Screen name="MessagesScreen" component={MessagesScreen} options={{ headerShown: true }} />
  </Stack.Navigator>
);

const ViewPostProduct = () => (
  <Stack.Navigator screenOptions={defaultHeaderOptions}>
    <Stack.Screen name="ProductListByUser" component={ProductListByUser} options={{ title: 'Status Post' }} />
    <Stack.Screen name="ProductDetailUser" component={ProductDetailUser} />
    <Stack.Screen name="EditProduct" component={EditProduct} />
  </Stack.Navigator>
);

const Package = () => (
  <Stack.Navigator initialRouteName="PackageScreen" screenOptions={defaultHeaderOptions}>
    <Stack.Screen name="PackageScreen" component={PackageScreen} options={{ title: 'PackageScreen' }} />
    <Stack.Screen name="PayPalPayment" component={PayPalPayment} options={{ title: 'PayPalPayment' }} />
    <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
    <Stack.Screen name="CancelScreen" component={CancelScreen} />
  </Stack.Navigator>
);
const UserProfileScreenUser = () => (
  <Stack.Navigator screenOptions={defaultHeaderOptions}>
    <Stack.Screen name="ProfileScreen" component={UserProfileScreen} options={{  title: 'View UserProfileScreen' }} />
  </Stack.Navigator>
);
const BottomTabsForUser = () => (
  <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#CB75EA', tabBarInactiveTintColor: 'gray', tabBarStyle: { backgroundColor: '#3B3B3B' }, tabBarShowLabel: false, tabBarIconStyle: { display: 'flex' } }}>
    <Tab.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="shop" size={size} color={color} />) }} />
    <Tab.Screen name="CreateProduct" component={CreateProduct} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="circle-plus" size={size} color={color} />) }} />
    <Tab.Screen name="Chat" component={Chat} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="message" size={size} color={color} />) }} />
    <Tab.Screen name="ViewPostProduct" component={ViewPostProduct} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="list-check" size={size} color={color} />) }} />
    <Tab.Screen name="UserProfileScreen" component={UserProfileScreenUser} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="circle-user" size={size} color={color} />) }} />
    <Tab.Screen name="Package" component={Package} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="paypal" size={size} color={color} />) }} />
  </Tab.Navigator>
);

const HomeStackAdmin = () => (
  <Stack.Navigator screenOptions={defaultHeaderOptions}>
    <Stack.Screen name="Home" component={Home} />
  </Stack.Navigator>
);

const Quanlyuser = () => (
  <Stack.Navigator screenOptions={defaultHeaderOptions}>
    <Stack.Screen name="ListUser" component={ListUser} options={{ headerShown: true, title: 'View User List' }} />
    <Stack.Screen name="UserDetail" component={UserDetail} options={{ headerShown: true, title: 'User Details' }} />
  </Stack.Navigator>
);

const QuanlyPost = () => (
  <Stack.Navigator screenOptions={defaultHeaderOptions}>
    <Stack.Screen name="ViewPostsMain" component={ViewPostsMain} options={{ headerShown: true }} />
    <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: true }} />
  </Stack.Navigator>
);

const Category = () => (
  <Stack.Navigator screenOptions={defaultHeaderOptions}>
    <Stack.Screen name="CategoryManager" component={CategoryManager} options={{ headerShown: true, title: 'View Category List' }} />
  </Stack.Navigator>
);

const UserProfileAdmin = () => (
  <Stack.Navigator screenOptions={defaultHeaderOptions}>
    <Stack.Screen name="ProfileScreen" component={UserProfileScreen} options={{ headerShown: true, title: 'View UserProfileScreen' }} />
  </Stack.Navigator>
);

const BottomTabsForAdmin = () => (
  <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#CB75EA', tabBarInactiveTintColor: 'gray', tabBarStyle: { backgroundColor: '#3B3B3B' }, tabBarShowLabel: false, tabBarIconStyle: { display: 'flex' } }}>
    <Tab.Screen name="HomeStack" component={HomeStackAdmin} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="shop" size={size} color={color} />) }} />
    <Tab.Screen name="Quanlyuser" component={Quanlyuser} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="users" size={size} color={color} />) }} />
    <Tab.Screen name="QuanlyPost" component={QuanlyPost} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="list-check" size={size} color={color} />) }} />
    <Tab.Screen name="Category" component={Category} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="align-left" size={size} color={color} />) }} />
    <Tab.Screen name="UserProfile" component={UserProfileAdmin} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="circle-user" size={size} color={color} />) }} />
  </Tab.Navigator>
);

export default function App() {
  const navigationRef = useRef(null);
  const [initialURL, setInitialURL] = useState(null);

  const handleDeepLink = (event) => {
    let data = Linking.parse(event.url);
    console.log("Deep link data:", data);
    if (data.path === 'success') {
      navigationRef.current.navigate('SuccessScreen');
    } else if (data.path === 'cancel') {
      navigationRef.current.navigate('CancelScreen');
    }
  };

  useEffect(() => {
    const getInitialURL = async () => {
      const url = await Linking.getInitialURL();
      setInitialURL(url);
    };

    getInitialURL();

    Linking.addEventListener('url', handleDeepLink);

    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  useEffect(() => {
    if (initialURL) {
      const data = Linking.parse(initialURL);
      console.log("Initial URL data:", data);
      if (data.path === 'success') {
        navigationRef.current.navigate('SuccessScreen');
      } else if (data.path === 'cancel') {
        navigationRef.current.navigate('CancelScreen');
      }
    }
  }, [initialURL]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterUser} />
        <Stack.Screen name="User" component={BottomTabsForUser} />
        <Stack.Screen name="Admin" component={BottomTabsForAdmin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
