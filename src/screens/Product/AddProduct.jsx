import React, { useState } from 'react';
import { View, Text,StyleSheet,Modal,TextInput, Button,TouchableOpacity , Alert,ActivityIndicator,Image } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';

const AddProduct = () => {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [modal, setModal] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
 
  React.useEffect(() => {
    fetchCategories();
    fetchProvinces();
  }, []);

  const fetchCategories = async () => {
    try {
        const response = await fetch('http://appchodocu.ddns.net:3000/product/category');
        const data = await response.json();
        setCategories(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
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

  const handleSubmit = async () => {
    try {

      console.log("Sending product data:", {
        name, price, description, image, category, address: { province: selectedProvince, district: selectedDistrict, ward: selectedWard }
      });
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Error', 'No user token found. Please login again.');
        navigation.navigate('Login');
        return;
      }
      const response = await fetch('http://appchodocu.ddns.net:3000/product/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${userToken}`
        },
        body: JSON.stringify({
          name,
          price,
          description,
          image,
          category,
          address: {
            province: selectedProvince,
            district: selectedDistrict,
            ward: selectedWard
          }
        })
      });
      const data = await response.json(); 
      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
       }
      console.log(data);
      Alert.alert('Success', 'Product added successfully!');
      } catch (error) {
        console.error('Error adding product:', error);
        Alert.alert('Error', error.message || 'Failed to add product');  // Sử dụng thông điệp lỗi từ server
    }
  };
  
  const increasePrice = () => {
    setPrice(prevPrice => prevPrice + 1);
  };

  const decreasePrice = () => {
    setPrice(prevPrice => Math.max(0, prevPrice - 1));
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


const handleUpload = async (image) => {
  // Tạo một đối tượng FormData để gửi dữ liệu
  let formData = new FormData();
  // Thêm dữ liệu ảnh và các thông tin cần thiết cho Cloudinary vào formData
  formData.append('file', {
    uri: image.uri, // đường dẫn tới file ảnh
    type: 'image/jpeg', // loại của file
    name: 'upload.jpg' // tên file
  });
  formData.append('upload_preset', 'ackgbz0m'); // Preset bạn đã tạo trong Cloudinary
  formData.append('cloud_name', 'dvm8fnczy'); // Tên Cloud của bạn

  try {
    // Gửi yêu cầu POST tới Cloudinary với dữ liệu trong formData
    const response = await axios.post("https://api.cloudinary.com/v1_1/dvm8fnczy/image/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Thông báo định dạng dữ liệu gửi đi là form data
      }
    });

    if (response.status === 200) {
      console.log("Upload successful: ", response.data);
      // Cập nhật state nếu cần
      setImage(response.data.secure_url); // Lưu URL của ảnh được lưu trên Cloudinary
      setUploadedImage(response.data.secure_url);
      Alert.alert('Upload Successful', 'Your image has been uploaded successfully!');
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image: ", error);
    Alert.alert('Upload Failed', 'Failed to upload image.');
  }
};

const _uploadImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled) {
    handleUpload(result.assets[0]); // Gọi hàm handleUpload với đối tượng ảnh thu được
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
      handleUpload(result.assets[0]);
    } else {
      console.log("Image selection was cancelled");
    }
  };
  return (
    <View style={styles.container}>
      
      <ActivityIndicator animating={loading} size="large" color="#0000ff" />
    
      <Text>Create Product</Text>

      {/* {uploadedImage && (
        <Image source={{ uri: uploadedImage }} style={{ width: 200, height: 200 }} />
      )} */}

      <TextInput
        style={styles.inputtext}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />

      <View style={styles.containerprice}>
      <TouchableOpacity onPress={decreasePrice} style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <TextInput 
        style={styles.inputprice}
        onChangeText={text => setPrice(Number(text.replace(/[^0-9]/g, '')))}
        value={price.toString()}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={increasePrice} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      </View>
    
       <TextInput
        style={styles.textInput}
        onChangeText={setDescription}
        value={description}
        multiline
        placeholder="Nhập mô tả sản phẩm..."
        textAlignVertical="top" // Đảm bảo text bắt đầu từ đầu trong Android
      />
    
      <Picker
          selectedValue={category}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
          style={{ height: 50, width: 200 }}
      >
          <Picker.Item label="Select Category" value="" />
          {categories.map((category) => (
              <Picker.Item key={category._id} label={category.name} value={category._id} /> //value={cat._id} nếu muốn lấy id của category
          ))}
      </Picker>
<View style={styles.containerprice}>
<Picker
      selectedValue={selectedProvince}
      onValueChange={handleProvinceChange}
      style={{ height: 50, width: 100 }}
    >
      <Picker.Item label="Select Province" value="" />
      {provinces.map((province) => (
        <Picker.Item key={province.id} label={province.Name} value={province.Name} />
      ))}

    </Picker>

      <Picker
        selectedValue={selectedDistrict}
        onValueChange={handleDistrictChange}
        style={{ height: 50, width: 100 }}
      >
    <Picker.Item label="Select District" value="" />
    {districts && districts.map((district) => (
     <Picker.Item key={district.id} label={district.Name} value={district.Name} />
    ))}
    </Picker>

    <Picker
      selectedValue={selectedWard}
      onValueChange={handleWardChange}
      style={{ height: 50, width: 100 }}
    >
      <Picker.Item label="Select Ward" value="" />
      {wards && wards.map((ward) => (
  <Picker.Item key={ward.id} label={ward.Name} value={ward.Name} />
))}
    </Picker>

</View>

      <TextInput
        style={styles.inputtext}
        placeholder="Image URL"
        value={image}
        onChangeText={text => setImage(text)}
      />
        <Button icon="upload" style={styles.input} mode="contained" onPress={() => setModal(true)} title="Upload Image" />
        <Button icon="content-save" style={styles.input} mode="contained" onPress={() => handleSubmit()} title="Save" />
  
            <Modal
             animationType='slide'
             transparent={true}
             visible={modal}
             onRequestClose= {() => {setModal(false)}}
            >
                <View style={styles.modalView}>
                    <View style={styles.buttonModalView}>
                      
                        <IconButton icon="camera" onPress={_takePhoto} />
                        <IconButton icon="folder-image" onPress={_uploadImage} />
                                           
                    </View>
                   <IconButton icon="cancel" style={styles.input} mode="contained" onPress={() => setModal(false)} />
                </View>
            </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,

},
containerprice: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 10,

},
textInput: {
  height: 100, // Chiều cao ban đầu
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
},
  inputtext: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
},
inputprice: {
  borderRadius: 5,
  padding: 10,
  marginHorizontal: 5,
  textAlign: 'center',
  borderColor: '#ccc',
},
button: {
  padding: 8,
  backgroundColor: '#ddd',
  minWidth: 40,
  alignItems: 'center',
  justifyContent: 'center'
},
buttonText: {
  fontSize: 18,
  color: '#333',
},
buttonModalView:{
      flexDirection:'row',
      padding:10,
      justifyContent:'space-around',
      backgroundColor:'white',
      
  },
  modalView:{
      position:'absolute',
      bottom:2,
      width:'100%',
      height:120,
  }
});

export default AddProduct;
