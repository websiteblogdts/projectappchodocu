import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button, ActivityIndicator, Image, ScrollView, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../components/ProductStyles';
import config from '../../config/config';
import axios from 'axios';

const EditProduct = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [modal, setModal] = useState(false);

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

  const { productId, reloadProducts } = route.params;

  useEffect(() => {
    fetchCategories();
    fetchProduct(productId);
  }, []);

  const fetchProduct = async (productId) => {
    try {

      
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/product/${productId}`, {
        headers: {
          'Authorization': `${userToken}`
        }
      });
      const data = await response.json();

        const provinceData = await fetchProvinces();        ;
        const districtData = await fetchDistrict(data.address.provinces);
        const wardData = await fetchWard(data.address.districts);

      setProduct(data);

      setName(data.name);
      setPrice(data.price);
      setDescription(data.description);
      setCategory(data.category);
      setImages(data.images || []);
      setUploadedImage(data.images ? data.images[0] : '');

      setSelectedProvince(data.address.province);
      setSelectedDistrict(data.address.district);
      setSelectedWard(data.address.ward);

      setProvince(provinceData);
      setDistrict(districtData);
      setWard(wardData);
            console.log('Fetched Product Data:', data);

    } catch (error) {
      console.error('Error fetching product:', error);
    }
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
          'Authorization': `${userToken}`
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
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }
      // Nếu cập nhật thành công, điều hướng trở lại trang danh sách sản phẩm
      navigation.navigate('ProductListByUser');
      // Trigger reload products list in parent component
      reloadProducts();
      
    } catch (error) {
      // console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product. Please try again.');
    }
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

  const fetchDistrict = async (provinceName) => {
    try {
      const selectedProvince = province.find((p) => p.Name === provinceName);
      if (selectedProvince) {
        return selectedProvince.district;
      }
      return [];
    } catch (error) {
      console.error('Error fetching district:', error);
      return [];
    }
  };

  const fetchWard = async (districtName) => {
    try {
      const selectedDistrict = district.find((d) => d.Name === districtName);
      if (selectedDistrict) {
        return selectedDistrict.Wards;
      }
      return [];
    } catch (error) {
      console.error('Error fetching wards:', error);
      return [];
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
  

  return (
     <ScrollView contentContainerStyle={styles.container}>

  {product ? (
    <View style={styles.container}>
      <View style={styles.header2}>
        <View style={styles.header}>
          <View style={styles.imageandprice}>
            <TouchableOpacity onPress={() => setModal(true)} >
              <Image source={{ uri: uploadedImage }} style={styles.image} />
              <IconButton icon="upload" style={styles.uploadIcon} onPress={() => setModal(true)} />
            </TouchableOpacity>

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
              onPress={() => updateData()} 
            />

          </View>
        </View>

        <View style={styles.details}>
          <TextInput
            style={styles.inputtext}
            placeholder="Name"
            value={name}
            onChangeText={text => setName(text)}
          />

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

      <View style={styles.imageContainer}>
        {images.map((imageUri, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
            <TouchableOpacity onPress={() => handleRemoveImage(index)}>
              <IconButton icon="delete" />
            </TouchableOpacity>
          </View>
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
