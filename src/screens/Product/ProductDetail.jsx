import React, { useState, useEffect } from 'react';
import { Text, Image, ScrollView, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../components/ProductDetail';
import config from '../../config/config';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ProductDetail = ({ route, navigation }) => {
  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null); // New state for user role

  useEffect(() => {
    const productId = route.params.productId;
    fetchProduct(productId);
    fetchUserId();
    fetchUserRole(); // Fetch user role when component mounts
  }, [route.params.productId]);

  const fetchUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setUserId(userId);
    } catch (error) {
      console.error('Error fetching userId:', error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const userRole = await AsyncStorage.getItem('userRole'); // Assume userRole is stored in AsyncStorage
      setUserRole(userRole);
    } catch (error) {
      console.error('Error fetching userRole:', error);
    }
  };

  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await fetch(`${config.apiBaseURL}/product/category/${categoryId}`);
      const data = await response.json();
      setCategoryName(data.name);
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/product/${productId}`, {
        headers: {
          'Authorization': `${userToken}`
        }
      });
      const data = await response.json();
      setProduct(data);
      fetchCategoryName(data.category);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleImageSwipe = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const imageIndex = Math.floor(offsetX / 350); // Assuming each image has a fixed width of 350
    setCurrentImageIndex(imageIndex);
  };

  const renderImageIndicators = () => {
    return product.images.map((image, index) => (
      <View
        key={index}
        style={[
          styles.imageIndicator,
          currentImageIndex === index ? styles.activeImageIndicator : null
        ]}
      />
    ));
  };

  const sendmessvoinguoiban = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken || !userId) {
        throw new Error('User is not authenticated or userId is missing.');
      }

      const chatResponse = await fetch(`${config.apiBaseURL}/mess/newChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          userId: userId,
          productId: product._id
        })
      });

      const chatData = await chatResponse.json();
      const chatId = chatData._id;

      navigation.navigate('MessagesScreen', { chatId });
    } catch (error) {
      console.error('Error creating or sending message:', error);
    }
  };

  useEffect(() => {
    if (product && userId) {
      console.log('userId:', userId);
      console.log('product.author:', product.author);
    }
  }, [product, userId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product && userId ? (
        <>
          <ScrollView
            contentContainerStyle={styles.containerkhungimage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageSwipe}
          >
            {product.images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <Text style={styles.imageIndex}>{index + 1}/{product.images.length}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.imageIndicatorContainer}>
            {renderImageIndicators()}
          </View>

          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.category}>Category: {categoryName}</Text>
          <Text style={styles.address}>Address: {product.address.province}, {product.address.district}, {product.address.ward}</Text>
         
          <Text style={styles.category}>Description: </Text>
          <ScrollView style={styles.descriptionContainer}>
            <Text style={styles.description}>{product.description}</Text>
          </ScrollView>

          {userId !== product.author._id && userRole === 'user' && (
            <View style={styles.sendMessageButton}>
              <TouchableOpacity onPress={sendmessvoinguoiban}>
                <FontAwesome name="wechat" size={30} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

export default ProductDetail;
