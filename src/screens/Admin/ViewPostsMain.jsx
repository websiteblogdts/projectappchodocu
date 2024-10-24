//fix web
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl, Dimensions, Button,Alert,TextInput, Platform, Modal } from 'react-native';
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
  const [rejectionReason, setRejectionReason] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null); // Store the product ID for rejection
  const [showRejected, setShowRejected] = useState(false); // Trạng thái cho sản phẩm bị từ chối

  // const numColumns = 2;
  const numColumns = Platform.OS === 'web' ? 8 : 2; // Thay đổi số cột dựa trên nền tảng


  useEffect(() => {
    fetchProducts(approved, showRejected); // Cập nhật fetchProducts
  }, [approved, showRejected]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts(approved, showRejected); // Cập nhật lại sản phẩm khi quay lại
    });
    return unsubscribe;
  }, [navigation, approved, showRejected]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <FontAwesome5
            name={showRejected ? "times":  "file-excel" } // Chuyển đổi icon
            title={showRejected ? "Show Approved" : "Show Rejected"}
            onPress={toggleShowRejected}
            style={styles.buttonshowhide}
            color={showRejected ? "#4CAF50": "#FF5733" }
          />
          <FontAwesome5
            name="exchange-alt" 
            title={approved ? "Show Unapproved" : "Show Approved"}
            onPress={toggleApproved}
            style={styles.buttonshowhide}
            color={approved ? "#FF5733" : "#4CAF50"}
          />
        </View>
      ),
    });
  }, [navigation, approved, showRejected]);
  
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

  const fetchRejectedProducts = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/admin/rejected-products`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Fetched rejected products:', data); // Log rejected products
  
      if (Array.isArray(data)) {
        const sortedData = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by updatedAt date
        setProducts(sortedData);
      } else {
        showAlert('Thông báo', 'Dữ liệu sản phẩm không hợp lệ.');
      }
  
      if (!data || data.length === 0) {
        showAlert('Thông báo', 'Không tìm thấy sản phẩm nào bị từ chối.');
      }
    } catch (error) {
      showAlert('Lỗi', 'Không thể tải dữ liệu sản phẩm bị từ chối.');
    }
  };
  
  const fetchProducts = async (approved, showRejected) => {
    if (showRejected) {
      fetchRejectedProducts(); // Fetch rejected products if showRejected is true
      return; // Don't fetch approved products
    }
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const endpoint = showRejected ? 'approved=false' : (approved ? 'approved=true' : 'approved=false');
      const response = await fetch(`${config.apiBaseURL}/admin/products/?${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched data:', data); // Log dữ liệu nhận được từ API

      if (Array.isArray(data)) {
        const sortedData = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by updatedAt date
        setProducts(sortedData);
      } else {
        showAlert('Thông báo', 'Dữ liệu sản phẩm không hợp lệ.');
      }
      if (!data || data.length === 0) {
        showAlert('Thông báo', 'Không tìm thấy sản phẩm nào.');
      }
    } catch (error) {
      showAlert('Lỗi', 'Không thể tải dữ liệu sản phẩm.');
    }
  };

  const toggleShowRejected = () => {
    setShowRejected(!showRejected); // Chuyển đổi hiển thị sản phẩm bị từ chối
  };


  const calculateTimeSincePosted = (date) => {
    const now = moment();
    const postDate = moment(date);
    return postDate.from(now); // e.g., "2 minutes ago", "a day ago"
  };
  
  const openRejectionModal = (productId) => {
    setSelectedProductId(productId);
    setModalVisible(true);
  };

  const submitRejection = async (productId, rejectionReason) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/admin/product/${selectedProductId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectedReason: rejectionReason }), // Đảm bảo truyền lý do từ chối
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Xử lý sau khi từ chối thành công
      fetchProducts(approved);
      if (Platform.OS === 'web') {
        Swal.fire('Thành công!', 'Bài đăng đã bị từ chối.', 'success');
      } else {
        Alert.alert('Thành công!', 'Bài đăng đã bị từ chối.');
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      if (Platform.OS === 'web') {
        Swal.fire('Lỗi', 'Không thể từ chối bài đăng. Vui lòng thử lại.', 'error');
      } else {
        Alert.alert('Lỗi', 'Không thể từ chối bài đăng. Vui lòng thử lại.');
      }
    }
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
    fetchProducts(approved, showRejected).then(() => setRefreshing(false));
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
    // const backgroundColor = item.admin_approved ? '#C1FFC1' : '#BFEFFF';
    const backgroundColor = item.admin_rejected ? '#FFB6C1' : (item.admin_approved ? '#C1FFC1' : '#BFEFFF');

    return (
      <TouchableOpacity onPress={() => navigateToProductDetail(item._id)}>
       {!item.admin_rejected && (
            <TouchableOpacity
              style={[styles.approvalButton, item.admin_approved ? styles.unapproveButtonText : styles.approveButtonText]}
              onPress={() => toggleProductApproval(item._id)}
            >
              <Text style={styles.buttonText}>{item.admin_approved ? 'Unapprove' : 'Approve'}</Text>
            </TouchableOpacity>
          )}
          
            {!item.admin_approved && (
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => openRejectionModal(item._id)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        )}

        <View style={[styles.productContainer, { width: itemWidth, backgroundColor: backgroundColor }]}>
        
          {/* <Text style={styles.status}>{item.admin_approved ? 'Đã duyệt' : 'Đang chờ duyệt'}</Text> */}
        
          <Text style={styles.status}>
          {item.admin_rejected ? 'Đã từ chối' : (item.admin_approved ? 'Đã duyệt' : 'Đang chờ duyệt')}
        </Text>

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
          {item.admin_rejected && (
          <Text style={{ color: '#FF5733' }}>Lý do từ chối: {item.admin_rejected_reason}</Text>
        )}
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
        {/* Modal nhập lý do từ chối */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nhập lý do từ chối</Text>
              <TextInput
                style={styles.input}
                value={rejectionReason}
                onChangeText={setRejectionReason}
                placeholder="Lý do từ chối"
              />
              <Button
                title="Submit"
                onPress={async () => {
                  await submitRejection(selectedProductId, rejectionReason); // Gọi hàm submitRejection với productId và lý do từ chối
                  setModalVisible(false); // Đóng modal sau khi từ chối
                }}
              />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>


    </View>
  );
};

export default ViewPostsMain;
