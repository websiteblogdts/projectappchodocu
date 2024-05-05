import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';

const ProductListByUser = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const numColumns = 2;


  const fetchProducts = async () => {
    try {
      // Lấy token từ AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
  
      const response = await fetch(`${config.apiBaseURL}/product/productlistbyuser`, {
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
      // console.log('Dữ liệu sản phẩm:', data);
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
  };

  const reloadProducts = async () => {
    fetchProducts();
  };

  const renderProduct = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 32 - 16) / numColumns;
    const firstImageUri = item.images.length > 0 ? item.images[0] : null;

    const backgroundColor = item.admin_approved ? '#C1FFC1' : '#414141'; // Màu xám nếu chưa được duyệt
  
    return (
      <TouchableOpacity onPress={() => navigateToProductDetail(item._id)}>
        <View style={[styles.productContainer, { width: itemWidth, backgroundColor: backgroundColor }]}>
        <Text style={[styles.status, { color: item.admin_approved ? 'green' : 'gray' }]}>{item.admin_approved ? 'Đã duyệt' : 'Chờ xử lý'}</Text>
        {firstImageUri && (
          <Image
            source={{ uri: firstImageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        {/* {firstImageUri && (
    <ProductImage imageUri={firstImageUri} />
)} */}

<Text style={[styles.name, { color: item.admin_approved ? 'black' : 'white' }]}>{item.name}</Text>
<Text style={[styles.price, { color: item.admin_approved ? 'black' : 'white' }]}>${item.price}</Text>
          {/* <Text style={styles.price}>${item.price}</Text> */}
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
    backgroundColor: '#3B3B3B',
  },
  productContainer: {
    width: 160, // chiều rộng cố định
    height: 260, // chiều cao cố định
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
    color: "white",
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
    height: 36, // Cố định chiều cao, đủ cho 2 dòng text
    overflow: 'hidden' // Ngăn text vượt quá chiều cao đã định
  },
  price: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4, // Đảm bảo cách đều từ text tên sản phẩm
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#888', // Màu cho text trạng thái
    marginTop: 5,
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
    // justifyContent: 'center',
  },
});

export default ProductListByUser;
