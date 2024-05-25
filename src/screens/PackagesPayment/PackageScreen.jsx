import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import config from '../../config/config';
import { useNavigation } from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';

const PackageScreen = () => {
  const [packages, setPackages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${config.apiBaseURL}/payments/packages`);
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleBuyPackage = async (packageId) => {
    try {
      const response = await fetch(`${config.apiBaseURL}/payments/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (response.status === 200) {
        const { orderId, approvalUrl } = data;
        console.log(data);
        navigation.navigate('PayPalPayment', { orderId, approvalUrl });
      } else {
        Alert.alert('Error', data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemPrice}>Price: ${item.price}</Text>
      <Text style={styles.itemPoints}>Points: {item.points}</Text>
      <Text style={styles.itemDuration}>Duration: {item.duration} days</Text>
      <Fontisto name="paypal" size={35} color="gray" onPress={() => handleBuyPackage(item._id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={packages}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
