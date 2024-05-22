import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl, Dimensions,Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
       <FontAwesome5
          name="exchange-alt" 
          title={approved ? "Show Unapproved" : "Show Approved"}
          onPress={toggleApproved}
          style={styles.buttonshowhide}
          color={approved ? "#FF5733" : "#4CAF50"}
        />
        ),
    });
  },);

  const fetchProducts = async (approved) => {
    try {            
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Token from AsyncStorage:', userToken);
      const endpoint = approved ? 'approved=true' : 'approved=false';
      const response = await fetch(`${config.apiBaseURL}/admin/products/?${endpoint}`,{
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
    }
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
              await fetch(`${config.apiBaseURL}/admin/product/${productId}/approved`, {
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
    const firstImageUri = item.images.length > 0 ? item.images[0] : null;
    const backgroundColor = item.admin_approved ? '#C1FFC1' : '#BFEFFF';

    return (
      <TouchableOpacity onPress={() => navigateToProductDetail(item._id)}>
<TouchableOpacity
          style={[styles.approvalButton, item.admin_approved ? styles.unapproveButtonText : styles.approveButtonText]}
          onPress={() => toggleProductApproval(item._id)}
        >
          <Text style={styles.buttonText}>{item.admin_approved ? "Unapprove" : "Approve"}</Text>
        </TouchableOpacity>
        <View style={[styles.productContainer, { width: itemWidth, backgroundColor: backgroundColor } ]}>
        
        <Text style={styles.status}>{item.admin_approved ? 'Đã duyệt' : 'Đang chờ duyệt'}</Text>

        {firstImageUri && (
          <Image
            source={{ uri: firstImageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
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
    backgroundColor: '#3B3B3B',
  },
  buttonshowhide: {
    borderRadius: 10, // Độ bo viền
    paddingVertical: 10, // Khoảng cách dọc
    paddingHorizontal: 20, // Khoảng cách ngang
    fontSize: 16, // Kích thước chữ
  },
  productContainer: {
    width: 160, 
    height: 250, 
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
  status: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#888', 
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    flex:1,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10, // Bo góc cho hình ảnh
    borderWidth: 2, // Độ dày của viền
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
    borderRadius: 15,
    marginTop: 7,
  },
  approveButtonText: {
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
  },
  unapproveButtonText: {
    backgroundColor: '#FF5733',
    color: 'white',
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  }
});

export default ViewPostsMain;
