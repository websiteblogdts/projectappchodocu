import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, ScrollView  } from 'react-native';


const ProductDetail = ({ route }) => {
  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState('');

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
      const response = await fetch(`http://appchodocu.ddns.net:3000/product/${productId}`);
      const data = await response.json();
      setProduct(data);
      fetchCategoryName(data.category);
    } catch (error) {
      console.error('Error fetching product:', error);
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
          {/* <Text style={styles.category}>Category: {product.category}</Text>  */}
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
    width: '90%',
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


export default ProductDetail;