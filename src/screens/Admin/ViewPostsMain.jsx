//fix web
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl, Dimensions, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Swal from 'sweetalert2';
import styles from '../../components/ViewPost';
import moment from 'moment';

const ViewPostsMain = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [approved, setApproved] = useState(false);
  // const numColumns = 2;
  const numColumns = Platform.OS === 'web' ? 8 : 2; // Thay đổi số cột dựa trên nền tảng

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
  }, [navigation, approved]);
  
  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      Swal.fire({
        title: title,
        text: message,
        icon: 'info',
        confirmButtonText: 'OK'
      });
    } else {
      Alert.alert(title, message, [{ text: 'OK' }]);
    }
  };
const fetchProducts = async (approved) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('Token from AsyncStorage:', userToken);
    const endpoint = approved ? 'approved=true' : 'approved=false';
    const response = await fetch(`${config.apiBaseURL}/admin/products/?${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Ensure data is an array before sorting
    if (Array.isArray(data)) {
      const sortedData = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by updatedAt date
      setProducts(sortedData);
      // console.log('Fetched products:', sortedData);
    } else {
      // console.error('Data is not an array:', data);
      showAlert('Thông báo', 'Dữ liệu sản phẩm không hợp lệ.');
    }
    if (!data || data.length === 0) {
      // setProducts(sortedData);
      showAlert('Thông báo', 'Không tìm thấy sản phẩm nào.');
    }
  } catch (error) {
    // console.error('Error fetching products:', error);
    showAlert('Lỗi', 'Không thể tải dữ liệu sản phẩm.');
  }
};


  const calculateTimeSincePosted = (date) => {
    const now = moment();
    const postDate = moment(date);
    return postDate.from(now); // e.g., "2 minutes ago", "a day ago"
  };
  
  const toggleProductApproval = async (productId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (Platform.OS === 'web') {
        Swal.fire({
          title: 'Xác nhận',
          text: 'Bạn có chắc chắn muốn cập nhật trạng thái sản phẩm này?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await fetch(`${config.apiBaseURL}/admin/product/${productId}/approved`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
              }
            });
            fetchProducts(approved);
            Swal.fire('Thành công!', 'Trạng thái sản phẩm đã được cập nhật.', 'success');
          }
        });
      } else {
        Alert.alert(
          'Xác nhận',
          'Bạn có chắc chắn muốn cập nhật trạng thái sản phẩm này?',
          [
            { text: 'Hủy', style: 'cancel' },
            {
              text: 'Đồng ý',
              onPress: async () => {
                await fetch(`${config.apiBaseURL}/admin/product/${productId}/approved`, {
                  method: 'PUT',
                  headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                  }
                });
                fetchProducts(approved);
                Alert.alert('Thành công!', 'Trạng thái sản phẩm đã được cập nhật.');
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error updating product approval status:', error);
      if (Platform.OS === 'web') {
        Swal.fire('Lỗi', 'Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.', 'error');
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.');
      }
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
          <Text style={styles.buttonText}>{item.admin_approved ? 'Unapprove' : 'Approve'}</Text>
        </TouchableOpacity>
        <View style={[styles.productContainer, { width: itemWidth, backgroundColor: backgroundColor }]}>
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
          <Text style={styles.time}>{calculateTimeSincePosted(item.updatedAt)}</Text>

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

export default ViewPostsMain;
