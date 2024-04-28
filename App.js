import React from 'react';
import { View, StyleSheet } from 'react-native';
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
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Màn hình Home Stack khai báo gì thì dùng được cái đó, khai báo mới hiển thị được.
//dành cho user
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: true ,title: 'View Product List'}} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: true ,title: 'View Product List'}}/>
    </Stack.Navigator>
  );
}
function CreateProduct(){
    return(
      <Stack.Navigator>
        <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
}
function ViewPostProduct() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductListByUser" component={ProductListByUser}  options={{ title: 'Status Post'}} />
      <Stack.Screen name="ProductDetailUser" component={ProductDetailUser} />
      <Stack.Screen name="EditProduct" component={EditProduct} />
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
          } else if (route.name === 'CreateProduct') {
            iconName = focused ? 'circle-plus' : 'circle-plus';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'Chat' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'UserProfileScreen') {
            iconName = focused ? 'user-tie' : 'user-tie';
          }else if (route.name === 'ViewPostProduct') {
            iconName = focused ? 'list-check' : 'list-check';
          }
          return <FontAwesome6 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF3399',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: '#FFFFCC',
        }
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="CreateProduct" component={CreateProduct}  />
      <Tab.Screen name="UserProfileScreen" component={UserProfileScreen} />
      <Tab.Screen name="ViewPostProduct" component={ViewPostProduct} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function HomeStackAdmin() {
  return (
    <Stack.Navigator>
    <Stack.Screen name="Home" component={Home}/> 
    </Stack.Navigator>
  );
}

function Quanlyuser() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListUser" component={ListUser} options={{ headerShown: true, title: 'View User List' }} />
      <Stack.Screen name="UserDetail" component={UserDetail} options={{ headerShown: true, title: 'User Details' }}/>
    </Stack.Navigator>
  );
} 
function QuanlyPost()
{
  return (
    <Stack.Navigator>
      <Tab.Screen name="ViewPostsMain" component={ViewPostsMain} options={{ headerShown: true }} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: true }} />
      </Stack.Navigator>
  )
}
function Category() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CategoryManager" component={CategoryManager} options={{ headerShown: true, title: 'View Category List' }} />
    </Stack.Navigator>
  );
}
function BottomTabsForAdmin() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeStack') {
            iconName = focused ? 'house' : 'house';
          }
          if (route.name === 'Category') {
            iconName = focused ? 'list' : 'list';
          }
          else if (route.name === 'Quanlyuser') {
            iconName = focused ? 'user-lock' : 'user-lock';
          } else if (route.name === 'QuanlyPost') {
            iconName = focused ? 'list-check' : 'list-check';
          } else if (route.name === 'UserProfileScreen') {
            iconName = focused ? 'user-secret' : 'user-secret';
          }else if (route.name === 'RegisterUser') {
            iconName = focused ? '' : '';
          }
          return (
            <View style={styles.iconContainer}>
              <FontAwesome6 name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#FF3399',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
         
          backgroundColor: '#FFFFCC',
        }
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStackAdmin} options={{ headerShown: false, title: 'Home' }}/>
      <Tab.Screen name="QuanlyPost" component={QuanlyPost} options={{ headerShown: false, title: 'View Posts' }} />
      <Tab.Screen name="Quanlyuser" component={Quanlyuser} options={{ headerShown: false, title: 'Users' }} />
      <Tab.Screen name="Category" component={Category} options={{ headerShown: false, title: 'View Category List' }} />
      <Tab.Screen name="UserProfileScreen" component={UserProfileScreen} options={{ title: 'View Trang Ca Nhan Account' }} />   
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
