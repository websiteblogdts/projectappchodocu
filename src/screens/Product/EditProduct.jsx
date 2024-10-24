
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Modal, TextInput, Button, ActivityIndicator, Image, ScrollView, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../components/AddProduct';
import config from '../../config/config';
import axios from 'axios';

const EditProduct = ({  navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [modal, setModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [product, setProduct] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);


  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');


  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
    const route = useRoute();

  const { productId } = route.params;

  useEffect(() => {
    fetchProduct(productId);
    fetchCategories();
    fetchProvinces(); // Fetch provinces when the component mounts
    // fetchDistrict();
    // fetchWard();
  }, []);

 

  const fetchProduct = async (productId) => {
    try {

      
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/product/${productId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      const data = await response.json();


      setProduct(data);

      setName(data.name);
      setPrice(data.price);
      setDescription(data.description);
      setCategory(data.category);
      setImages(data.images || []);
      setUploadedImage(data.images ? data.images[0] : '');
      setSelectedCategory(data.category);
      // const districtData = await fetchDistrict(data.address.province);
      // const wardData = await fetchWard(data.address.district);
      // setWards(wardData);
      // setDistricts(selectedDistrict);
// Cập nhật tỉnh, quận, xã
      setSelectedProvince(data.address.province);
      setSelectedDistrict(data.address.district);
      setSelectedWard(data.address.ward);

      // setSelectedProvince(data.address.province);
      // setDistricts(districtData); // Cập nhật danh sách quận
      // setSelectedDistrict(data.address.district);
      // setWards(wardData); // Cập nhật danh sách xã
      // setSelectedWard(data.address.ward);


  // In log các giá trị
  // console.log('Districts:', districtData); // Log danh sách quận
  console.log('Selected District:', data.address.district);
  // console.log('Wards:', wardData); // Log danh sách xã
  console.log('Selected Ward:', data.address.ward);
  console.log('Name:', data.name);
  console.log('Price:', data.price);
  console.log('Description:', data.description);
  console.log('Category:', data.category);
  console.log('Images:', data.images);
  console.log('Fetched Product Data:', data);
            console.log('Fetched Product Data:', data);

    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

//   const fetchProvinces = async () => {
//     try {
//         const response = await fetch('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
//         const data = await response.json();
//         console.log('Fetched provinces data:', data); // Log dữ liệu để kiểm tra
//         setProvinces(data); // Đặt tỉnh vào state
//     } catch (error) {
//         console.error('Error fetching provinces:', error);
//     }
// };


  const fetchProvinces = async () => {
    try {
        const response = await fetch('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
        const data = await response.json();
        setProvinces(data); // Đặt tỉnh vào state
        console.log('Fetched Provinces:', data); // In ra danh sách các tỉnh

        // Truy xuất địa chỉ
        // const address = data.map(province => ({
        //   province: province.Name,  // Sửa lại từ provinces.name thành province.Name
        //   districts: province.Districts.map(district => ({
        //     name: district.Name,  // Sửa lại từ district.name thành district.Name
        //     wards: district.Wards || [], // Nếu có danh sách xã
        //   }))
        // }));
        
      // console.log('Address:', address); // In ra địa chỉ đã lấy

      } catch (error) {
        console.error('Error fetching provinces:', error);
    }
};

// // Lưu ý: Khi fetch district và ward, bạn cần lấy thông tin từ `provinces`, không phải từ `province`
// // Thay đổi từ `province` thành `provinces` trong hàm fetchDistrict và fetchWard

const fetchDistrict = async (provinceName) => {
  try {
    const selectedProvince = provinces.find((p) => p.Name === provinceName); // Tìm tỉnh đã chọn
    if (selectedProvince) {
      const districtsData = selectedProvince.Districts;
      setDistricts(districtsData); // Cập nhật danh sách quận huyện
      return districtsData; // Trả về danh sách quận huyện
    }
    return [];
  } catch (error) {
    console.error('Error fetching district:', error);
    return [];
  }
};
// const fetchDistrict = async (province) => {
//   try {
//     const response = await fetch(`${config.apiBaseURL}/districts?province=${province}`);
//     const data = await response.json();
//     console.log('Fetched Districts:', data); // In ra dữ liệu quận
//     return data; // Đảm bảo trả về dữ liệu
//   } catch (error) {
//     console.error('Error fetching districts:', error);
//     return []; // Trả về mảng trống nếu có lỗi
//   }
// };

const fetchWard = async (districtName) => {
  try {
    const selectedDistrict = districts.find((d) => d.Name === districtName); // Tìm quận huyện đã chọn
    if (selectedDistrict) {
      const wardsData = selectedDistrict.Wards;
      setWards(wardsData); // Cập nhật danh sách xã
      return wardsData; // Trả về danh sách xã
    }
    return [];
  } catch (error) {
    console.error('Error fetching wards:', error);
    return [];
  }
};

// const fetchWard = async (district) => {
//   try {
//     const response = await fetch(`${config.apiBaseURL}/wards?district=${district}`);
//     const data = await response.json();
//     console.log('Fetched Wards:', data); // In ra dữ liệu xã
//     return data; // Đảm bảo trả về dữ liệu
//   } catch (error) {
//     console.error('Error fetching wards:', error);
//     return []; // Trả về mảng trống nếu có lỗi
//   }
// };

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
  




  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.apiBaseURL}/product/category`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const updateData = async () => {
    try {
    
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/product/editproduct/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          name,
          price,
          description,
          images,
          category,
          address: {
            province: selectedProvince,
            district: selectedDistrict,
            ward: selectedWard
          }
        })
      });
      const data = await response.json();
      // console.log(data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }
      Alert.alert('Success', 'Product Update successfully!');
       // Nếu cập nhật thành công, điều hướng trở lại trang danh sách sản phẩm
       navigation.navigate('ProductListByUser');
    } catch (error) {
      // console.error('Error adding product:', error);
      Alert.alert('Error rui son oi', error.message || 'Failed to add product');
  }  
};

  
  

  const increasePrice = () => {
    if (price === '' || price === '1') {
      setPrice('2');
    } else {
      setPrice(prevPrice => Number(prevPrice) + 1);
    }
  };

  const decreasePrice = () => {
    if (price === '' || price === '1') {
      setPrice('0');
    } else {
      setPrice(prevPrice => Math.max(1, prevPrice - 1));
    }
  };
  
  const handleUploadNhieuAnh = async (image) => {
    let formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'upload.jpg'
    });
    formData.append('upload_preset', 'ackgbz0m');
    formData.append('cloud_name', 'dvm8fnczy');
    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/dvm8fnczy/image/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      if (response.status === 200) {
        // console.log("Upload successful: ", response.data);
        setImages(prevImages => [...prevImages, response.data.secure_url]);
        setUploadedImage(response.data.secure_url);
        Alert.alert('Upload Successful', 'Your image has been uploaded successfully!');
        console.log("Uploaded image:", image); // Log ra ảnh được chọn để upload
        setModal(false)
      } else {
        setModal(false)
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert('Upload Failed', 'Failed to upload image.');
    }
  };
  
  
  const handleRemoveImage = (indexToRemove) => {
    setImages(prevImages => {
      const newImages = prevImages.filter((_, index) => index !== indexToRemove);
      // Update the uploadedImage to the last image in the new array or null if empty
      setUploadedImage(newImages.length > 0 ? newImages[newImages.length - 1] : null);
      return newImages;
    });
  };
  
  
  const _uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      multiple: true // Thêm đoạn này để cho phép chọn nhiều ảnh
    });
  
    if (!result.cancelled) {
      handleUploadNhieuAnh(result.assets[0]); 
      // console.log("Uploaded image:", result.assets[0]);
      // Gọi hàm handleUpload với đối tượng ảnh thu được
    } else {
      // console.log("Image selection was cancelled");
    }
  };
  
  const _takePhoto = async () => {
    // Same here for camera permissions
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
    }
    const result = await ImagePicker.launchCameraAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });
  
    if (!result.cancelled) {
        // handleUpload(result.assets[0]);
        handleUploadNhieuAnh(result.assets[0]);
        // console.log("Uploaded image:", result.assets[0]);
  
      } else {
        // console.log("Image selection was cancelled");
      }
    };
  
    const handleScroll = (event) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const width = event.nativeEvent.layoutMeasurement.width;
      const index = Math.floor(scrollPosition / width);
      setCurrentImageIndex(index);
    };

  return (
     <ScrollView >

  {product ? (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header2}>

        <IconButton icon="upload" 
        style={styles.uploadIcon}
        size={100} 
        color="#9C9C9C"
        onPress={() => setModal(true)} 
        />
          <View style={styles.imageandprice}>
            <TouchableOpacity onPress={() => setModal(true)} >
              <Image source={{ uri: uploadedImage }} style={styles.image} />
            </TouchableOpacity>
          </View>

          <View>
            <View style={styles.priceContainer}>
              <TouchableOpacity onPress={decreasePrice} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>

              <TextInput 
                style={styles.inputprice}
                onChangeText={text => setPrice(Number(text.replace(/[^0-9]/g, '')))}
                value={'$' + price}
                keyboardType="numeric"
              />

              <TouchableOpacity onPress={increasePrice} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>

            </View>

            <IconButton 
              icon="content-save"
              style={styles.saveIcon} 
              size={50}
              color="#9C9C9C"
              onPress={() => updateData()} 
              title="Save" 

            />

          </View>
        </View>

        <View style={styles.details}>
        <View style={styles.inputContainer}>

          <TextInput
            style={styles.inputname}
            placeholder="Enter a title for the article/product"
            placeholderTextColor="#888"
            value={name}
            onChangeText={text => setName(text)}
            maxLength={40}
          />
<Text style={styles.charCount}>
              {name.length}/40
            </Text>
            </View>

          <View style={styles.category}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.categoryPicker}
            >
              <Picker.Item label="Select Category" value="" />
              {categories.map((category) => (
                <Picker.Item key={category._id} label={category.name} value={category._id} />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.textInput}
            onChangeText={setDescription}
            value={description}
            multiline
            placeholder="Nhập mô tả sản phẩm..."
            textAlignVertical="top"
            placeholderTextColor="#888" 
          />

          <View style={styles.containeraddress}>

        <Text style={styles.addressLabel}>Address</Text>
            <Picker
              selectedValue={selectedProvince}
              onValueChange={handleProvinceChange}
              style={styles.addressSelect}
            >
              <Picker.Item key="selectProvince" label="Select Province" value="" />
              {provinces.map((province) => (
                <Picker.Item key={province.Name} label={province.Name} value={province.Name} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedDistrict}
              onValueChange={handleDistrictChange}
              style={styles.addressSelect}
            >
              <Picker.Item label="Select District" value="" />
              {districts.map((district) => (
                <Picker.Item key={district.Name} label={district.Name} value={district.Name} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedWard}
              onValueChange={handleWardChange}
              style={styles.addressSelect}
            >
              <Picker.Item label="Select Ward" value="" />
              {wards.map((ward) => (
                <Picker.Item key={ward.Name} label={ward.Name} value={ward.Name} />
              ))}
            </Picker>


          </View>
        </View>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      >      
        {images.map((imageUri, index) => (
          // <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View key={imageUri} style={styles.imageContainerdelete}>
            <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveImage(index)}>
            <Ionicons name="trash-bin" size={30} color="gray" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.indicatorContainer}>
        {images.map((image, index) => (
          <View
            key={index}
            style={[
              styles.imageIndicator,
              { backgroundColor: currentImageIndex === index ? '#000' : '#ccc' }
            ]}
          />
        ))}
      </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modal}
        onRequestClose={() => setModal(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.buttonModalView}>
            <IconButton icon="camera" onPress={_takePhoto} />
            <IconButton icon="folder-image" onPress={_uploadImage} />
          </View>
          <IconButton icon="cancel" style={styles.cancelupload} mode="contained" onPress={() => setModal(false)} />
        </View>
      </Modal>
    </View>
) : (
  <Text>Loading...</Text>
)}
    </ScrollView>

  );
};

export default EditProduct;
