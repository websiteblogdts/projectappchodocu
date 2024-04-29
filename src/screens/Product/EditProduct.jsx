import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Modal, TextInput, Button, ActivityIndicator, Image, ScrollView, Alert } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../components/ProductStyles';

const EditProduct = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    // fetchProvince();
    // fetchDistrict();
    // fetchWard();
  }, []);

  useEffect(() => {
const fetchProduct = async () => {
  try {
    const productId = route.params.productId;
    const response = await fetch(`http://appchodocu.ddns.net:3000/product/${productId}`);
    const data = await response.json();

    const provinceData = await fetchProvince();
    const districtData = await fetchDistrict(data.address.province);
    const wardData = await fetchWard(data.address.district);

        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setImage(data.image);
        setUploadedImage(data.image);
        setCategory(data.category);
        // Lấy danh sách tỉnh/thành
        setProvince(provinceData);
  
        // Lấy danh sách quận/huyện dựa trên tỉnh/thành đã chọn
        setDistrict(districtData);
  
        // Lấy danh sách phường/xã dựa trên quận/huyện đã chọn
        setWard(wardData);

        setSelectedProvince(data.address.province);
        setSelectedDistrict(data.address.district);
        setSelectedWard(data.address.ward);
        setIsLoading(false);
  } catch (error) {
    console.error('Error fetching product:', error);
    setIsLoading(false);
  }
};
fetchProduct();    
}, [route.params.productId]);


const fetchCategories = async () => {
  try {
      const response = await fetch('http://appchodocu.ddns.net:3000/product/category');
      const data = await response.json();
      setCategories(data);
  } catch (error) {
      console.error('Error fetching categories:', error);
  }
};
  const updateData = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      const response = await fetch(`http://appchodocu.ddns.net:3000/product/editproduct/${route.params.productId}`, {
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

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      Alert.alert(`${data.name} is Updated successfully!!`);
      navigation.navigate("ProductList");
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Failed to update product');
    }
  };


  

const fetchProvince = async () => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
    const data = await response.json();
    // setProvince(data);
    // fetchProduct();
    return data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
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
    // const ward = selectedDistrict.ward;
    // setWards(ward);
    // return ward;
    return selectedDistrict.Wards;
  }
  return [];
} catch (error) {
  console.error('Error fetching wards:', error);
  return [];
}
};
  // const increasePrice = () => {
  //   setPrice(prevPrice => Number(prevPrice) + 1); // Chuyển prevPrice thành số trước khi cộng
  // };
  const increasePrice = () => {
    if (price === '' || price === '1') {
      setPrice('2'); // Nếu price đang là rỗng hoặc là '1', thiết lập giá trị mới là '2'
    } else {
      setPrice(prevPrice => Number(prevPrice) + 1); // Ngược lại, thực hiện cộng thêm 1 như bình thường
    }
  };
  
  // const decreasePrice = () => {
  //   setPrice(prevPrice => Math.max(0, prevPrice - 1));
  // };
  const decreasePrice = () => {
    if (price === '' || price === '1') {
      setPrice('0'); // Nếu price là rỗng hoặc là '1', thiết lập giá trị mới là '0'
    } else {
      setPrice(prevPrice => Math.max(1, prevPrice - 1)); // Ngược lại, giảm giá trị đi 1 như bình thường
    }
  };
  const handleProvinceChange = async (province) => {
    setSelectedProvince(province);
    setDistrict(await fetchDistrict(province));
    setWard([]);
    setSelectedDistrict('');
    setSelectedWard('');
  };
  
  const handleDistrictChange = async (district) => {
    setSelectedDistrict(district);
    setWard(await fetchWard(district));
    setSelectedWard('');
  };
  
  const handleWardChange = (ward) => {
    setSelectedWard(ward);
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
        console.log("Upload successful: ", response.data);
        setImages(prevImages => [...prevImages, response.data.secure_url]);
        setUploadedImage(response.data.secure_url);
        Alert.alert('Upload Successful', 'Your image has been uploaded successfully!');
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
    // Xóa hình ảnh khỏi mảng images
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };
  
  const _uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled) {
      // handleUpload(result.assets[0]);
      handleUploadNhieuAnh(result.assets[0]); // Gọi hàm handleUpload với đối tượng ảnh thu được
    } else {
      console.log("Image selection was cancelled");
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
        setImage(result.uri);
        // handleUpload(result.assets[0]);
        handleUploadNhieuAnh(result.assets[0]);
      } else {
        console.log("Image selection was cancelled");
      }
    };
  

  return (
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
          onValueChange={(itemValue) => setSelectedProvince(itemValue)}
          style={styles.addressSelect}
        >
          <Picker.Item label="Select Province" value="" />
          {province.map((province) => (
            <Picker.Item key={province.id} label={province.Name} value={province.Name} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedDistrict}
          onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
          style={styles.addressSelect}
        >
          <Picker.Item label="Select District" value="" />
          {district.map((district) => (
            <Picker.Item key={district.id} label={district.Name} value={district.Name} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedWard}
          onValueChange={(itemValue) => setSelectedWard(itemValue)}
          style={styles.addressSelect}
        >
          <Picker.Item label="Select Ward" value="" />
          {ward.map((ward) => (
            <Picker.Item key={ward.id} label={ward.Name} value={ward.Name} />
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
  );
};

export default EditProduct;