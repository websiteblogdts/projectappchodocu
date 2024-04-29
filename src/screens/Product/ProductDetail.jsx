import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, ScrollView ,View  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const response = await fetch(`http://appchodocu.ddns.net:3000/product/category/${categoryId}`);
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
      const response = await fetch(`http://appchodocu.ddns.net:3000/product/${productId}`,{
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
    const imageIndex = Math.round(offsetX / 350); // Assuming each image has a fixed width of 300
    setCurrentImageIndex(imageIndex);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product ? (
        <>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <ScrollView style={styles.descriptionContainer}>
            <Text style={styles.description}>{product.description}</Text>
          </ScrollView>
            <ScrollView
            contentContainerStyle={styles.container}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageSwipe}
          >
            {product && product.images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <Text style={styles.imageIndex}>{index + 1}/{product.images.length}</Text>
              </View>
            ))}
          </ScrollView>
          {/* {product.image && <Image source={{ uri: product.image }} style={styles.image} />} */}
          <Text style={styles.category}>Category: {categoryName}</Text> 
          <Text style={styles.address}>Address: {product.address.province}, {product.address.district}, {product.address.ward}</Text>
        
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 4 / 3,
  },
  imageIndex: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    marginBottom: 8,
  },
  descriptionContainer: {
    maxHeight: 105,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
  },

  category: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  address: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  updateButton: {
    marginRight: 8,
  },
});


export default ProductDetail;