import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl, Dimensions,Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ViewPostsMain = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [approved, setApproved] = useState(false); // false means unapproved, true means approved
  const numColumns = 2;

  useEffect(() => {
    fetchProducts(approved);
  }, [approved]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts(approved);
    });
    return unsubscribe;
  }, [navigation, approved]);

  const fetchProducts = async (approved) => {
    try {            
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Token from AsyncStorage:', userToken);
      const endpoint = approved ? 'approved=true' : 'approved=false';
      const response = await fetch(`http://appchodocu.ddns.net:3000/admin/products/?${endpoint}`,{
        headers: {
          'Authorization': `${userToken}`
        }
      });
      const data = await response.json();
      
      // Kiểm tra nếu không có sản phẩm hoặc dữ liệu không tồn tại
      if (!data || data.length === 0) {
        showAlert("Thông báo", "Không tìm thấy sản phẩm nào.");
      } else {
        setProducts(data);
        console.log("Fetched products:", data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert("Lỗi", "Không thể tải sản phẩm. Vui lòng thử lại.");
    }
  };
  
  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };
  
  const toggleProductApproval = async (productId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      
      // Hiển thị cảnh báo xác nhận
      Alert.alert(
        'Xác nhận',
        'Bạn có chắc chắn muốn cập nhật trạng thái sản phẩm này?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Đồng ý',
            onPress: async () => {
              await fetch(`http://appchodocu.ddns.net:3000/admin/product/${productId}/approved`, {
                method: 'PUT',
                headers: {
                  'Authorization': `${userToken}`,
                  'Content-Type': 'application/json'
                }
              });
  
              // Tải lại danh sách sản phẩm sau khi cập nhật
              fetchProducts(approved);
            },
          },
        ],
        { cancelable: false }
      );

    } catch (error) {
      console.error('Error updating product approval status:', error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.");
    }
  };

  
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(approved).then(() => setRefreshing(false));
  };

  const navigateToProductDetail = (productId) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const toggleApproved = () => {
    setApproved(!approved);
  };

  const renderProduct = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 32 - 16) / numColumns;
    return (
      <TouchableOpacity onPress={() => navigateToProductDetail(item._id)}>
        <View style={[styles.productContainer, { width: itemWidth }]}>
          
          {item.image && 
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="contain"
            />
          }
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price}</Text>
          
        </View>
        <TouchableOpacity style={styles.approvalButton} onPress={() => toggleProductApproval(item._id)} >
            <Text style={styles.buttonText}>{item.admin_approved ? "Unapprove" : "Approve"}</Text>
          </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Button title={approved ? "Show Unapproved" : "Show Approved"} onPress={toggleApproved} />
      {products.length === 0 ? (
        <Text style={styles.emptyText}>Danh sách trống</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id.toString()}
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
    backgroundColor: '#FFFACD',
  },
  productContainer: {
    width: 160, // chiều rộng cố định
    height: 250, // chiều cao cố định
    // flex: 1,  // Cho phép container mở rộng để lấp đầy không gian khả dụng
    // minHeight: 250, // Đặt chiều cao tối thiểu để đảm bảo tính nhất quán
    backgroundColor: '#FFE4C4',
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
  approvalButton:  {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  }
});

export default ViewPostsMain;
