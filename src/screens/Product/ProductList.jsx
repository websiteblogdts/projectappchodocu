import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,CustomCardView, StyleSheet, Alert,Image,Button, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';

const ProductListScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const numColumns = 2; 


  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
    });
    return unsubscribe;
  }, [navigation]);


  const fetchProducts = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Token from AsyncStorage:', userToken);
      // Đảm bảo rằng tham số truy vấn approved được thiết lập là true
      const response = await fetch(`${config.apiBaseURL}/product/productdaduyet`, {
        headers: {
          'Authorization': `${userToken}`
        }
      });
      const data = await response.json();
      setProducts(data);
      console.log("Fetched products:", data);
      if (data.length === 0) {
        Alert.alert("Thông báo", "Không tìm thấy sản phẩm nào.");
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert("Lỗi", "Không thể tải sản phẩm. Vui lòng thử lại.");
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts().then(() => setRefreshing(false));
  };

  const navigateToProductDetail = (productId) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const renderProduct = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 32 - 16) / numColumns; // 16 là tổng padding và margin của container, 8 là khoảng cách giữa các cột
    const firstImageUri = item.images.length > 0 ? item.images[0] : null;

    return (
      <TouchableOpacity onPress={() => navigateToProductDetail(item._id)}>
        <View style={[styles.productContainer, { width: itemWidth }]}>
        {firstImageUri && (
          <Image
            source={{ uri: firstImageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
                    <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price}</Text>
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
    backgroundColor: '#3B3B3B',

  },
  productContainer: {
    width: 160, // chiều rộng cố định
    height: 250, // chiều cao cố định
    // flex: 1,  // Cho phép container mở rộng để lấp đầy không gian khả dụng
    // minHeight: 250, // Đặt chiều cao tối thiểu để đảm bảo tính nhất quán
    backgroundColor: '#B4EEB4',
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
    textAlign: 'center',

  },
  price: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',

  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10, // Bo góc cho hình ảnh
    borderWidth: 2, // Độ dày của viền
    borderColor: '#EED5B7' // Màu sắc của viền
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContent: {
    flexGrow: 1,
  },

  card: {
    borderRadius: 24,
    width: '75%',
    height: 170,
    margin: 10,
    overflow: 'hidden',
},
});

export default ProductListScreen;