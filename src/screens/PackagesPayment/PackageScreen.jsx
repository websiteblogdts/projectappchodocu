import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert , Linking} from 'react-native';
import config from '../../config/config';
import { useNavigation } from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import AddPackage from '../PackagesPayment/AddPackageModal';  // Import AddPackage modal

const PackageScreen = () => {
  const [packages, setPackages] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); // State to store user ID
  const [token, setToken] = useState(null); // State to store token
  const [approvalUrl, setApprovalUrl] = useState(null); // Lưu URL của PayPal
  const [modalVisible, setModalVisible] = useState(false);
  const [role, setRole] = useState(null); // State to store user role


  useEffect(() => {
    fetchUserData(); // Call function to get token and user ID
    fetchPackages();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        role === 'admin' && ( // Check if the user is an admin
          <Fontisto
            name="plus-a"
            size={24}
            color="white"
            onPress={() => setModalVisible(true)} // Open modal on button press
            style={{ marginRight: 10 }}
          />
        )
      ),
    });
  }, [navigation, role]); // Add role to the dependencies

  const fetchUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUserId = await AsyncStorage.getItem('userId'); // Assuming you stored userId in AsyncStorage
      const storedRole = await AsyncStorage.getItem('userRole'); // Assuming you stored role in AsyncStorage
      setRole(storedRole); // Store role in state
      setToken(storedToken);
      setUserId(storedUserId);
      console.log('User ID:', storedUserId);
      console.log('Token:', storedToken);
      console.log('Role:', storedRole); // Log the user's role
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const fetchPackages = async () => {
    console.log('Fetching packages from:', `${config.apiBaseURL}/payments/packages`);
    try {
      const response = await fetch(`${config.apiBaseURL}/payments/packages`);
      const data = await response.json();
      console.log('Fetched packages:', data);
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };
 // Gọi lại fetchPackages sau khi thêm gói thành công
 const handlePackageAdded = () => {
  fetchPackages();
};
  const handleBuyPackage = async (packageId) => {
    setLoading(true);
    console.log('Creating payment for packageId:', packageId);
    console.log('User ID:', userId); // Log userId
    console.log('Token:', token); // Log token

    try {
        const response = await fetch(`${config.apiBaseURL}/payments/create-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ packageId, userId }),
        });

        const data = await response.json();
        console.log('Create payment response:', data);

        if (response.status === 200) {
            const { orderId, approvalUrl } = data;
            console.log('Navigating to PayPalPayment with orderId and approvalUrl:', orderId, approvalUrl);
            setApprovalUrl(approvalUrl);
        } else {
            Alert.alert('Error', data.error || 'Something went wrong');
        }
    } catch (error) {
        console.error('Error creating payment:', error);
        Alert.alert('Error', 'Something went wrong');
    } finally {
        setLoading(false);
    }
};


  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>

      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemPrice}>Price: ${item.price}</Text>
      <Text style={styles.itemPoints}>Points: {item.points}</Text>
      <Text style={styles.itemDuration}>Duration: {item.duration} days</Text>
     
      <Fontisto             
      title={loading ? "Processing..." : "Pay with PayPal"}
      name="paypal"
      size={35} color="gray"
      onPress={() => handleBuyPackage(item._id)} 
      disabled={loading}
      />

    </View>
  );
  return (
    <View style={styles.container}>
      {approvalUrl ? (
        <WebView
          source={{ uri: approvalUrl }}
          style={{ flex: 1 }}
          onNavigationStateChange={async (event) => {
            if (event.url.includes('payments/success')) {
              setApprovalUrl(null); // Ẩn WebView
              // Hiển thị thông báo thành công
              Alert.alert('Success', 'Thanh toán thành công. Ngày hết hạn VIP: ');
              // + vipExpiryDate
              console.log('Oke payment - Done update vip/point account');
            } else if (event.url.includes('payments/cancel')) {
              setApprovalUrl(null); // Ẩn WebView sau khi thanh toán bị hủy
              Alert.alert('Pail', 'Cancel');
            }
          }}
        />
      ) : (
        <FlatList
          data={packages}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
        />
      )}

      <AddPackage
        visible={modalVisible}
        onClose={() => setModalVisible(false)} // Close modal
        onPackageAdded={handlePackageAdded} // Pass the callback to the modal
      />

    </View>
);



};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#3B3B3B',
  },
  itemContainer: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    marginTop: 5,
  },
  itemPoints: {
    fontSize: 14,
    marginTop: 5,
  },
  itemDuration: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default PackageScreen;
