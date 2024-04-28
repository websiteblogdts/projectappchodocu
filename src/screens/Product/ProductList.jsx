import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image,Button, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductListScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const numColumns = 2; 

  const refreshData = () => {
    // Gọi hàm làm mới dữ liệu ở đây
    console.log('Refreshing data...');
  };

  useEffect(() => {
    // Gọi hàm làm mới dữ liệu khi màn hình được hiển thị
    refreshData();
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://appchodocu.ddns.net:3000/product');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts().then(() => setRefreshing(false));
  };

  const navigateToProductDetail = (productId) => {
    navigation.navigate('ProductDetail', { productId });
  };

  // const reloadProducts = async () => {
  //   fetchProducts();
  // };

  const renderProduct = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 32 - 16) / numColumns; // 16 là tổng padding và margin của container, 8 là khoảng cách giữa các cột
    return (
      <TouchableOpacity onPress={() => navigateToProductDetail(item._id)}>
        <View style={[styles.productContainer, { width: itemWidth }]}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price}</Text>
          {item.image && 
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="contain"
            />
          }
        </View>
      </TouchableOpacity>
    );
  };

  return (
    
    <View style={styles.container}>
      {products.length === 0 ? (
        <Text style={styles.emptyText}>Danh sách trống</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={numColumns}
          contentContainerStyle={styles.flatListContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#CAE1FF',

  },
  productContainer: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    marginBottom: 15,
    marginHorizontal: 2,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContent: {
    flexGrow: 1,
  },
});

export default ProductListScreen;
