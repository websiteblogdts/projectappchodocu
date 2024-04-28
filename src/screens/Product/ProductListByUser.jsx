import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductListByUser = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const numColumns = 2;


  const fetchProducts = async () => {
    try {
      // Lấy token từ AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
  
      const response = await fetch('http://appchodocu.ddns.net:3000/product/productlistbyuser', {
        headers: {
          'Authorization': `${userToken}` // Thêm token vào header
        }
      });
  
      if (!response.ok) {
        // Kiểm tra mã trạng thái của response để xác định lỗi
        if (response.status === 401) {
          console.error('Unauthorized: Token không hợp lệ hoặc đã hết hạn');
        } else {
          console.error('Đã xảy ra lỗi:', response.statusText);
        }
        return; // Ngừng tiếp tục xử lý nếu có lỗi
      }
  
      const data = await response.json();
      console.log('Dữ liệu sản phẩm:', data);
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
    navigation.navigate('ProductDetailUser', { productId: productId, reloadProducts: reloadProducts });
    // navigation.navigate('ProductDetail', { productId });
  };

  const reloadProducts = async () => {
    fetchProducts();
  };

  const renderProduct = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 32 - 16) / numColumns;
    return (
      <TouchableOpacity onPress={() => navigateToProductDetail(item._id)}>
        <View style={[styles.productContainer, { width: itemWidth }]}>
           <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
         
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {products.length === 0 ? (
        <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
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
    backgroundColor: '#E6E6E6',
  },
  productContainer: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    marginBottom: 15,
    marginHorizontal: 8,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 6,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default ProductListByUser;
