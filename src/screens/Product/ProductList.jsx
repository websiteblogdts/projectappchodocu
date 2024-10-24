// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, Alert,Image, TouchableOpacity, RefreshControl, Dimensions,TextInput, Picker } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import config from '../../config/config';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import moment from 'moment';

// const ProductListScreen = () => {
//   const navigation = useNavigation();
//   const [products, setProducts] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const numColumns = 2;
//   const [viewMode, setViewMode] = useState('grid');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [maxPrice, setMaxPrice] = useState(null);
//   const [categoryFilter, setCategoryFilter] = useState(null);
//   const [sortOrder, setSortOrder] = useState('new'); // 'new' hoặc 'old'
  
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <MaterialCommunityIcons name={viewMode === 'grid' ? 'view-list' : 'view-grid'} 
//         title="Logout" size={30} color="#EA7575" 
//         style={styles.iconlogout} 
//         onPress={toggleViewMode} />
//         ),
//     });
//   },);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       fetchProducts();
//     });
//     return unsubscribe;
//   }, [navigation]);


//   const fetchProducts = async () => {
//     try {
//       const userToken = await AsyncStorage.getItem('userToken');
//       console.log('Token from AsyncStorage:', userToken);
//       // Đảm bảo rằng tham số truy vấn approved được thiết lập là true
//       const response = await fetch(`${config.apiBaseURL}/product/productdaduyet`, {
//         headers: {
//           'Authorization': `Bearer ${userToken}`
//         }
//       });
//       const data = await response.json();
//       const sortedData = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by updatedAt date
//       setProducts(sortedData);
//       if (data.length === 0) {
//         Alert.alert("Thông báo", "Không tìm thấy sản phẩm nào.");
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       Alert.alert("Lỗi", "Không thể tải sản phẩm. Vui lòng thử lại.");
//     }
//   };
  
//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchProducts().then(() => setRefreshing(false));
//   };

//   const navigateToProductDetail = (productId) => {
//     navigation.navigate('ProductDetail', { productId });
//   };

//   const toggleViewMode = () => {
//     setViewMode(viewMode === 'grid' ? 'list' : 'grid');
//   };
  

//   const calculateTimeSincePosted = (date) => {
//     const now = moment();
//     const postDate = moment(date);
//     return postDate.from(now); // e.g., "2 minutes ago", "a day ago"
//   };

//     const renderProduct = ({ item }) => {
//     const screenWidth = Dimensions.get('window').width;
//     const firstImageUri = item.images.length > 0 ? item.images[0] : null;
//     const itemWidth = viewMode === 'grid' ? (screenWidth - 32 - (numColumns - 1) * 8) / numColumns : screenWidth - 32;
//     const itemHeight = viewMode === 'grid' ? 250 : 120;  // Chiều cao thay đổi theo chế độ xem
//     const styles = viewMode === 'grid' ? gridStyles : listStyles;

//     return (
      
//       <TouchableOpacity onPress={() => navigateToProductDetail(item._id)}>
//         <View style={[styles.productContainer, { width: itemWidth , height: itemHeight }]}>
//         {item.images[0] && (

//             <Image
//             source={{ uri: item.images[0] }}
//             style={styles.image}
//             resizeMode="cover"
//           />
         
//         )}
//         <View style={styles.nameandprice}>
//         <Text style={styles.price}>${item.price}</Text>
//         <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
//           {item.name}
//         </Text>
//         <Text style={styles.time}>{calculateTimeSincePosted(item.updatedAt)}</Text>
//         </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

   
// return (
//   <View style={styles.container}>
//     {products.length === 0 ? (
//    <Text style={styles.emptyText}>Danh sách trống</Text>
//     ) : (
//       <FlatList
//         data={products}
//         renderItem={renderProduct}
//         keyExtractor={(item) => item._id}
//         key={viewMode}  // Thêm dòng này để đảm bảo FlatList được re-render khi viewMode thay đổi
//         numColumns={viewMode === 'grid' ? numColumns : 1}
//         contentContainerStyle={styles.flatListContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//           />
//         }
//       />
//     )}
//   </View>
// );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 12,
//     backgroundColor: '#3B3B3B',
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   price: {
//     fontSize: 16,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   flatListContent: {
//     flexGrow: 1,
//   },
//   toggleButton: {
//     padding: 10,
//     backgroundColor: 'blue',
//     borderRadius: 5,
//     alignSelf: 'center',
//     margin: 10,
//   },
//   toggleButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },


// });
// const gridStyles = StyleSheet.create({
//   productContainer: {
//     // width: 160,
//     // height: 250,
//     backgroundColor: '#B4EEB4',
//     borderRadius: 8,
//     marginBottom: 10,
//     marginHorizontal: 2,
//     padding: 5,
//     shadowColor: "black", // Màu đổ bóng
//     shadowOffset:{width: 1, height: 2,} ,// Khoảng cách đổ bóng theo chiều dọc
//     shadowOpacity: 4.25, // Độ mờ của bóng
//     shadowRadius: 5.84, // Bán kính của đổ bóng
//     elevation: 5, // Sử dụng cho Android để hiển thị đổ bóng
//     overflow: 'hidden',
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   price: {
//     fontWeight: 'bold',
//     fontSize: 18,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   image: {
//     width: '100%',
//     aspectRatio: 1,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#EED5B7'
//   },
//     time: {
//     fontSize: 14,
//     color: 'gray',
//     textAlign: 'center',
//   },

// });


// //dạng sanh sách ngang
// const listStyles = StyleSheet.create({
//   productContainer: {
//    flexDirection:'row',
//     backgroundColor: '#B4EEB4',
//     borderRadius: 25,
//     margin: 30,
//     padding: 16,
//     marginBottom: 15,
//     marginHorizontal: 25,
//   },
//   nameandprice:{
//     right:30,
//       flexDirection:'colume',
//       justifyContent: "space-around",
//       width:"60%",
//   },
//   name: {
//     fontSize: 13,  // Có thể giảm kích thước font nếu cần
//     fontWeight: 'bold',
//     textAlign: 'left',
//     flex: 1, // Thêm để `name` chiếm hết không gian còn lại sau `image`
//   },
//   price: {
//     fontSize: 15,  // Giảm kích thước font cho giá
//     marginBottom: 10,
//     textAlign: 'left',
//     fontWeight: 'bold',
//   },
//   image: {
//     bottom:45,
//     right:37,
//     width: 100,
//     height: 120,
//     borderRadius: 20,
//     borderColor: 'black',
//   },
//     time: {
//     fontSize: 14,
//     color: 'gray',
//   },
// });

// export default ProductListScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,  Alert, Image, TouchableOpacity, RefreshControl, Dimensions, TextInput, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Slider from '@react-native-community/slider';
import { styles, gridStyles, listStyles } from '../../components/ProductListHome';

const ProductListScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const numColumns = 2;
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  // const [maxPrice, setMaxPrice] = useState(null);
  const [maxPrice, setMaxPrice] = React.useState(10); // Giá tối đa khởi tạo
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState('new');
  const [filterModalVisible, setFilterModalVisible] = useState(false); // Thêm trạng thái cho modal lọc
  const [categories, setCategories] = useState([]); // Trạng thái cho danh mục
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  useEffect(() => {
    fetchProducts();
    fetchProvinces();
    fetchCategories();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name={viewMode === 'grid' ? 'view-list' : 'view-grid'}
            size={30}
            color="#EA7575"
            style={styles.iconlogout}
            onPress={toggleViewMode}
          />
          <MaterialCommunityIcons
            name="filter"
            size={30}
            color="#EA7575"
            onPress={() => setFilterModalVisible(true)} // Mở modal lọc
          />
        </View>
      ),
      headerTitle: () => (
        <TextInput
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={styles.searchInput}
        />
      ),
    });
  }, [viewMode, searchQuery]);

  // Hàm lấy danh mục từ API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.apiBaseURL}/product/category`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/product/productdaduyet`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
            console.log('fetching products:', data);

      const sortedData = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      const filteredData = filterProducts(sortedData);
      setProducts(filteredData);
      if (data.length === 0) {
        Alert.alert("Thông báo", "Không tìm thấy sản phẩm nào.");
      }
    } catch (error) {
      // console.error('Error fetching products:', error);
      Alert.alert("Lỗi", error);
    }
  };

  const searchProducts = (products, query) => {
    if (!query) return products; // Nếu không có chuỗi tìm kiếm, trả về tất cả sản phẩm
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  };
  
  const filterProducts = (products) => {
    let filteredProducts = products;
    
     filteredProducts = searchProducts(filteredProducts, searchQuery);

    // Lọc theo giá tối đa
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }

    // Lọc theo danh mục
    if (categoryFilter) {
      filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }

 // Filter by address (province, district, ward)
 if (selectedProvince) {
  filteredProducts = filteredProducts.filter(product => product.address.province === selectedProvince);
}
if (selectedDistrict) {
  filteredProducts = filteredProducts.filter(product => product.address.district === selectedDistrict);
}
if (selectedWard) {
  filteredProducts = filteredProducts.filter(product => product.address.ward === selectedWard);
}
    // Sắp xếp theo thời gian đăng
    filteredProducts = filteredProducts.sort((a, b) => {
      return sortOrder === 'new'
        ? new Date(b.updatedAt) - new Date(a.updatedAt)
        : new Date(a.updatedAt) - new Date(b.updatedAt);
    });

    return filteredProducts;
  };
  const fetchProvinces = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    const selectedProvince = provinces.find((p) => p.Name === province);
    if (selectedProvince) {
      setDistricts(selectedProvince.Districts);
    } else {
      setDistricts([]);
    }
    setWards([]);
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    const selectedDistrict = districts.find((d) => d.Name === district);
    if (selectedDistrict) {
      setWards(selectedDistrict.Wards);
    } else {
      setWards([]);
    }
    setSelectedWard('');
  };

  const handleWardChange = (ward) => {
    setSelectedWard(ward);
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

  const calculateTimeSincePosted = (date) => {
    const now = moment();
    const postDate = moment(date);
    return postDate.from(now);
  };

  const renderProduct = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const firstImageUri = item.images.length > 0 ? item.images[0] : null;
    const itemWidth = viewMode === 'grid' ? (screenWidth - 32 - (numColumns - 1) * 8) / numColumns : screenWidth - 32;
    const itemHeight = viewMode === 'grid' ? 250 : 120;
    const styles = viewMode === 'grid' ? gridStyles : listStyles;

    return (
      <TouchableOpacity onPress={() => navigateToProductDetail(item._id)}>
        <View style={[styles.productContainer, { width: itemWidth, height: itemHeight }]}>
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
            <Text style={styles.time}>{calculateTimeSincePosted(item.updatedAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
    fetchProducts(); // Tải lại sản phẩm sau khi áp dụng bộ lọc
  };

  return (
    <View style={styles.container}>
   {searchProducts(products, searchQuery).length === 0 ? (
        <Text style={styles.emptyText}>Danh sách trống</Text>
      ) : (
        <FlatList
          // data={products}
          data={searchProducts(products, searchQuery)} // Gọi hàm searchProducts tại đây
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          key={viewMode}
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

<Modal
    animationType="slide"
    transparent={true}
    visible={filterModalVisible}
    onRequestClose={() => setFilterModalVisible(false)}
>
    <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Bộ Lọc Sản Phẩm</Text>
 <Text style={styles.label}>Chọn Tỉnh:</Text>
          <Picker
            selectedValue={selectedProvince}
            onValueChange={(itemValue) => {
              handleProvinceChange(itemValue); // Hàm xử lý thay đổi tỉnh
            }}
            style={styles.picker}
          >
            <Picker.Item label="Tất cả" value="" />
            {provinces.map((province) => (
              <Picker.Item key={province.Name} label={province.Name} value={province.Name} />
            ))}
          </Picker>

          <Text style={styles.label}>Chọn Huyện:</Text>
          <Picker
            selectedValue={selectedDistrict}
            onValueChange={(itemValue) => {
              handleDistrictChange(itemValue); // Hàm xử lý thay đổi huyện
            }}
            style={styles.picker}
            enabled={selectedProvince !== ""}
          >
            <Picker.Item label="Tất cả" value="" />
            {districts.map((district) => (
              <Picker.Item key={district.Name} label={district.Name} value={district.Name} />
            ))}
          </Picker>

          <Text style={styles.label}>Chọn Xã:</Text>
          <Picker
            selectedValue={selectedWard}
            onValueChange={(itemValue) => {
              handleWardChange(itemValue); // Hàm xử lý thay đổi xã
            }}
            style={styles.picker}
            enabled={selectedDistrict !== ""}
          >
            <Picker.Item label="Tất cả" value="" />
            {wards.map((ward) => (
              <Picker.Item key={ward.Name} label={ward.Name} value={ward.Name} />
            ))}
          </Picker>
            <Text style={styles.label}>Chọn Danh Mục:</Text>
            <Picker
                selectedValue={categoryFilter}
                onValueChange={(itemValue) => setCategoryFilter(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Tất cả" value={null} />
                {categories.map(category => (
                    <Picker.Item key={category._id} label={category.name} value={category._id} />
                ))}
            </Picker>

            {/* <Text style={styles.label}>Giá Tối Đa:</Text>
            <TextInput
                placeholder="Nhập giá tối đa"
                keyboardType="numeric"
                value={maxPrice}
                onChangeText={(value) => setMaxPrice(value)}
                style={styles.priceInput}
            /> */}
              <Text style={styles.label}>Giá Tối Đa: ${maxPrice}</Text>
                    <Slider
                        minimumValue={0}
                        maximumValue={100} // Thay đổi theo giá tối đa bạn muốn
                        step={1} // Đặt bước tăng giá
                        value={maxPrice}
                        onValueChange={(value) => setMaxPrice(value)}
                        style={styles.slider}
                    />
            <Text style={styles.label}>Thứ Tự:</Text>
            <Picker
                selectedValue={sortOrder}
                onValueChange={(itemValue) => setSortOrder(itemValue)}
                style={styles.picker}
            >
               
                        <Picker.Item label="Mới nhất" value="new" />
                        <Picker.Item label="Cũ nhất" value="old" />
                        <Picker.Item label="Giá: Thấp đến Cao" value="lowToHigh" />
                        <Picker.Item label="Giá: Cao đến Thấp" value="highToLow" />
            </Picker>

            <View style={styles.buttonContainer}>
                <Button title="Áp dụng" onPress={applyFilters} color="#CB75EA" />
                <Button title="Xóa bộ lọc" onPress={() => {
                    setMaxPrice(null);
                    setCategoryFilter(null);
                    setSortOrder('new');
                    setSelectedProvince('');
                    setSelectedDistrict('');
                    setSelectedWard('');                  }} color="gray" />
                <Button title="Đóng" onPress={() => setFilterModalVisible(false)} color="#EA7575" />
            </View>
        </View>
    </View>
</Modal>

    </View>
  );
};


export default ProductListScreen;
