import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, ScrollView  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 


const ProductDetailUser = ({ route, navigation }) => {
  const [product, setProduct] = useState(null);
  const { reloadProducts } = route.params;

  useEffect(() => {
    // Lấy ID của sản phẩm từ tham số định tuyến
    const productId = route.params.productId;
    fetchProduct(productId);
  }, [route.params.productId]);

  const fetchProduct = async (productId) => {
    try {
      const response = await fetch(`http://appchodocu.ddns.net:3000/product/${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleUpdateProduct = (productId) => {
    // Chuyển hướng đến trang cập nhật sản phẩm và truyền ID sản phẩm
    navigation.navigate('EditProduct', { productId: product._id , reloadProducts: reloadProducts
    });
  };

//   const handleDeleteProduct = () => {
//     // Hiển thị cảnh báo xác nhận xóa sản phẩm
//     Alert.alert(
//       'Xác nhận xóa sản phẩm',
//       'Bạn có chắc chắn muốn xóa sản phẩm này?',
//       [
//         { text: 'Hủy', style: 'cancel' },
//         { text: 'Xóa', onPress: confirmDeleteProduct }
//       ]
//     );
//   };

// const confirmDeleteProduct = async () => {
//     try {
//       await deleteProduct(product._id);
//       reloadProducts();
//       navigation.goBack();
//     } catch (error) {
//       console.error('Error deleting product:', error);
//     }
//   };
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
  
      const response = await fetch(`http://appchodocu.ddns.net:3000/product/deleteproduct/${productId}`, {
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
  

  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product ? (
        <>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <ScrollView style={styles.descriptionContainer}>
            <Text style={styles.description}>{product.description}</Text>
          </ScrollView>
          {product.image && <Image source={{ uri: product.image }} style={styles.image} />}
          <Text style={styles.category}>Category: {product.category}</Text> 

          <Text style={styles.address}>Address: {product.address.province}, {product.address.district}, {product.address.ward}</Text>
        
          <View style={styles.buttonContainer}>
            <Button title="Cập nhật" onPress={handleUpdateProduct} style={styles.updateButton} />
            <Button title="Xóa" onPress={handleDeleteProduct} />
          </View>
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
  image: {
    width: '77%',
    height: 'auto',
    aspectRatio: 1,
    marginTop: 8,
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


export default ProductDetailUser;