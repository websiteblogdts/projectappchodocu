import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert,Image, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../components/ProductList';

const ProductListScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const numColumns = 2; 
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons name={viewMode === 'grid' ? 'view-list' : 'view-grid'} 
        title="Logout" size={30} color="#EA7575" 
        style={styles.iconlogout} 
        onPress={toggleViewMode} />
        ),
    });
  },);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
    });
    return unsubscribe;
  }, [navigation]);


  const fetchProducts = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // console.log('Token from AsyncStorage:', userToken);
      // Đảm bảo rằng tham số truy vấn approved được thiết lập là true
      const response = await fetch(`${config.apiBaseURL}/product/productdaduyet`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      const data = await response.json();
      setProducts(data);
      // console.log("Fetched products:", data);
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

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };


    const renderProduct = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const firstImageUri = item.images.length > 0 ? item.images[0] : null;
    const itemWidth = viewMode === 'grid' ? (screenWidth - 32 - (numColumns - 1) * 8) / numColumns : screenWidth - 32;
    const itemHeight = viewMode === 'grid' ? 250 : 120;  // Chiều cao thay đổi theo chế độ xem
    const styles = viewMode === 'grid' ? gridStyles : listStyles;

    return (
      
      <TouchableOpacity onPress={() => navigateToProductDetail(item._id)}>
        <View style={[styles.productContainer, { width: itemWidth , height: itemHeight }]}>
        {item.images[0] && (
          
            <Image
            source={{ uri: item.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
         

        )}
        <View style={styles.nameandprice}>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
        
        </View>
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
          key={viewMode}  // Thêm dòng này để đảm bảo FlatList được re-render khi viewMode thay đổi
          numColumns={viewMode === 'grid' ? numColumns : 1}
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


export default ProductListScreen;