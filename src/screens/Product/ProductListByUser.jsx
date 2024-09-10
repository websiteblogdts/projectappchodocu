import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,  Image, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';
import styles from '../../components/ProductListUser';

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
          'Authorization': `Bearer ${userToken}` // Thêm token vào header
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


export default ProductListByUser;
