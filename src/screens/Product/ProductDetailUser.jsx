import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, ScrollView  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import styles from '../../components/ProductDetail';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import config from '../../config/config';

const ProductDetailUser = ({ route, navigation }) => {
  const [product, setProduct] = useState(null);
  const { reloadProducts } = route.params;
  const [categoryName, setCategoryName] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  React.useEffect(() => {
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
  const handleUpdateProduct = (productId) => {
    // Chuyển hướng đến trang cập nhật sản phẩm và truyền ID sản phẩm
    navigation.navigate('EditProduct', { productId: product._id , reloadProducts: reloadProducts
    });
  };

const handleDeleteProduct = () => {
    Alert.alert(
      'Xác nhận xóa sản phẩm',
      'Bạn có chắc chắn muốn xóa sản phẩm này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', onPress: () => {
          confirmDeleteProduct().then(() => {
            navigation.navigate('ProductListByUser');
          });
        }}
      ]
    );
};

const confirmDeleteProduct = async () => {
  try {
    await deleteProduct(product._id);
    return true; // Indicate success
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
  
const deleteProduct = async (productId) => {
  try {
      const userToken = await AsyncStorage.getItem('userToken');
  
      const response = await fetch(`${config.apiBaseURL}/product/deleteproduct/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${userToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Deleted product:', data);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Error deleting product');
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
          { backgroundColor: currentImageIndex === index ? '#000' : '#ccc' }
        ]}
      />
    ));
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product ? (
        <>
        <View style={styles.buttonContainer}>
            <FontAwesome title="Cập nhật" name="edit" onPress={handleUpdateProduct} size={30} color="gray" style={styles.updateButton} />
            <Ionicons title="Xóa" name="trash-bin" size={30} color="gray" onPress={handleDeleteProduct} />
          </View>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <ScrollView style={styles.descriptionContainer}>
            <Text style={styles.description}>{product.description}</Text>
          </ScrollView>
             <ScrollView
            contentContainerStyle={styles.container}
            horizontal // tắt này đi thì ảnh sẻ hiển thị dọc chứ không trược ngang.
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
          <View style={styles.imageIndicatorContainer}>
            {renderImageIndicators()}
          </View>

          <Text style={styles.category}>Category: {categoryName}</Text> 
          <Text style={styles.address}>Address: {product.address.province}, {product.address.district}, {product.address.ward}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};


export default ProductDetailUser;