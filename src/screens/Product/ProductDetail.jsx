import React, { useState, useEffect } from 'react';
import { Text,  Image, ScrollView ,View  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../components/ProductDetail';
import config from '../../config/config';
const ProductDetail = ({ route }) => {
  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Lấy ID của sản phẩm từ tham số định tuyến
    const productId = route.params.productId;
    fetchProduct(productId);
  }, [route.params.productId]);

  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await fetch(`${config.apiBaseURL}/product/category/${categoryId}`);
      const data = await response.json();
      setCategoryName(data.name); // Assuming the API response has a 'name' field
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('userToken', userToken);
      const response = await fetch(`${config.apiBaseURL}/product/${productId}`,{
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
    const imageIndex = Math.floor(offsetX / 350); // Assuming each image has a fixed width of 300
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


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product ? (
        <>
            <ScrollView
            contentContainerStyle={styles.containerkhungimage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageSwipe}
          >
            {product && product.images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image}/>
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
 
          <ScrollView style={styles.descriptionContainer}>
            <Text style={styles.description}>{product.description}</Text>
          </ScrollView>
        
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
  
};

export default ProductDetail;