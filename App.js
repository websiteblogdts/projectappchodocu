import React from 'react';
import 'react-native-get-random-values';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


//dành cho user
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>

      <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: true ,title: 'View Product List'}} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: true ,title: 'View Product List'}}/>
    </Stack.Navigator>
  );
}
function CreateProduct(){
    return(
  
      <Stack.Navigator screenOptions={defaultHeaderOptions}>
        <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerShown: true }} />
      </Stack.Navigator>
    );
}
function Chat(){
  return(
      <Stack.Navigator screenOptions={defaultHeaderOptions}>
      <Stack.Screen name="ListMess" component={ListMess} options={{ headerShown: true }} />
      <Stack.Screen name="MessagesScreen" component={MessagesScreen} options={{ headerShown: true }} />
      </Stack.Navigator>

  );
}
function ViewPostProduct() {
  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>

      <Stack.Screen name="ProductListByUser" component={ProductListByUser}  options={{ title: 'Status Post'}} />
      <Stack.Screen name="ProductDetailUser" component={ProductDetailUser} />
      <Stack.Screen name="EditProduct" component={EditProduct} />
    </Stack.Navigator>
  );
}
function BottomTabsForUser() {
  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: '#CB75EA', tabBarInactiveTintColor: 'gray',tabBarStyle: {backgroundColor: '#3B3B3B', }, tabBarShowLabel: false, tabBarIconStyle: { display: 'flex' }}} >

      <Tab.Screen name="HomeStack" component={HomeStack}
        options={{headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="shop" size={size} color={color} />)}} />

      <Tab.Screen 
        name="CreateProduct" 
        component={CreateProduct}
        options={{headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="circle-plus" size={size} color={color} />)}} />
      
      <Tab.Screen name="Chat" component={Chat}
        options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="message" size={size} color={color} />)}} />
  
      <Tab.Screen name="ViewPostProduct" component={ViewPostProduct}
        options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<FontAwesome6 name="list-check" size={size} color={color} />)}} />
  
      <Tab.Screen name="UserProfileScreen" component={UserProfile} 
      options={{ headerShown: false, tabBarIcon: ({ color, size }) => ( <FontAwesome6 name="circle-user" size={size} color={color} />)}} />
      

    </Tab.Navigator>
  );
}

////////////////////////////////////////////////////ADMIN////////////////////////////////////////////////// 

function HomeStackAdmin() {
  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>

    <Stack.Screen name="Home" component={Home}/> 
    </Stack.Navigator>
  );
}

function Quanlyuser() {
  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>

      <Stack.Screen name="ListUser" component={ListUser} options={{ headerShown: true, title: 'View User List' }} />
      <Stack.Screen name="UserDetail" component={UserDetail} options={{ headerShown: true, title: 'User Details' }}/>
    </Stack.Navigator>
  );
} 
function QuanlyPost()
{
  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>
      <Stack.Screen name="ViewPostsMain" component={ViewPostsMain} options={{ headerShown: true }} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: true }} />
      </Stack.Navigator>
  )
}
function Category() {
  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>
      <Stack.Screen name="CategoryManager" component={CategoryManager} options={{ headerShown: true, title: 'View Category List' }} />
    </Stack.Navigator>
  );
}
function UserProfile() {
  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>
      <Stack.Screen name="ProfileScreen" component={UserProfileScreen} options={{ headerShown: true, title: 'View UserProfileScreen' }} />
    </Stack.Navigator>
  );
}
function BottomTabsForAdmin() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#CB75EA',tabBarInactiveTintColor: 'gray',tabBarStyle: {backgroundColor: '#3B3B3B',},tabBarShowLabel: false,  tabBarIconStyle: { display: 'flex' } }}
>
  <Tab.Screen name="HomeStack"         component={HomeStackAdmin}
    options={{ headerShown: false,tabBarIcon: ({ color, size }) => (<FontAwesome6 name="chart-simple" size={size} color={color} />)}}/>

  <Tab.Screen name="Category"          component={Category}
    options={{ headerShown: false,tabBarIcon: ({ color, size }) => (<FontAwesome6 name="list" size={size} color={color} /> )}}/>
  
  <Tab.Screen name="Quanlyuser"        component={Quanlyuser}
    options={{ headerShown: false,tabBarIcon: ({ color, size }) => (<FontAwesome6 name="user-lock" size={size} color={color} />)}} />
 
  <Tab.Screen name="QuanlyPost"        component={QuanlyPost}
    options={{ headerShown: false ,tabBarIcon: ({ color, size }) => (<FontAwesome6 name="list-check" size={size} color={color} />)}}/>
 
  <Tab.Screen name="UserProfileScreen" component={UserProfile} 
  options={{ headerShown: false, tabBarIcon: ({ color, size }) => ( <FontAwesome6 name="user-secret" size={size} color={color} />)}} />
  
</Tab.Navigator>
  );
}

/////////////////////////////APP/////////////////////////
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


const defaultHeaderOptions = {
  headerStyle: {
    backgroundColor: '#3B3B3B', // Màu nền chung cho tất cả các header
  },
  headerTintColor: '#fff', // Màu của tiêu đề và nút
  headerTitleStyle: {
    fontWeight: 'bold' // Kiểu chữ của tiêu đề
  }
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 70, // Set the width and height as desired
    height: 70,
    borderRadius: 15, // Adjust the border radius to get the desired roundness
    // backgroundColor: 'white', // Change the background color as needed
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;
