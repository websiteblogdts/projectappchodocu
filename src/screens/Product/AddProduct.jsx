import React, { useState } from 'react';
import { View, Text,StyleSheet,Modal,TextInput, Button,TouchableOpacity ,ScrollView, Alert,ActivityIndicator,Image } from 'react-native';
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

  <View style={styles.header}>
    <View style={styles.header2}>
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
          // value={price.toString()}
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
  onPress={() => handleSubmit()} title="Save" />

      </View>
</View>
    <View style={styles.details}>
        <TextInput
          style={styles.inputtext}
          placeholder="Name"
          placeholderTextColor="white" 
          value={name}
          onChangeText={text => setName(text)}
        />
        <View style={styles.category}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.categoryPicker}
          >
             <Picker.Item label="Select Category" value="" />
           {categories.map((category) => (
              <Picker.Item key={category._id} label={category.name} value={category._id} /> //value={cat._id} nếu muốn lấy id của category
           ))}
          </Picker>
        </View>

        <TextInput
          style={styles.textInput}
          onChangeText={setDescription}
          value={description}
          multiline
          placeholder="Nhập mô tả sản phẩm..."
          placeholderTextColor="white" 
          textAlignVertical="top"
        />
        
     <View style={styles.containeraddress}>
      
     <Text style={styles.addressLabel}>Address</Text>
    <Picker
      selectedValue={selectedProvince}
      onValueChange={handleProvinceChange}
      style={styles.addressSelect}
    >
      <Picker.Item label="Select Province" value="" />
      {provinces.map((province) => (
        <Picker.Item key={province.id} label={province.Name} value={province.Name} />
      ))}

    </Picker>
      <Picker
        selectedValue={selectedDistrict}
        onValueChange={handleDistrictChange}
        style={styles.addressSelect}

      >
    <Picker.Item label="Select District" value="" />
    {districts && districts.map((district) => (
     <Picker.Item key={district.id} label={district.Name} value={district.Name} />
    ))}
    </Picker>

    <Picker
      selectedValue={selectedWard}
      onValueChange={handleWardChange}
      style={styles.addressSelect}

    >
      <Picker.Item label="Select Ward" value="" />
      {wards && wards.map((ward) => (
  <Picker.Item key={ward.id} label={ward.Name} value={ward.Name} />
))}
    </Picker>
    </View>
    </View>
    </View>
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
                   <IconButton icon="cancel" style={styles.cancelupload} mode="contained" onPress={() => setModal(false)} />
                </View>
            </Modal>
  </View>
);
};


const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: 'center',

    backgroundColor: '#707070',
  },
  saveIcon: {
    top: 30,
    left: 25,
  },
  containeraddress: {
    backgroundColor: '#898989',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '90%',
    paddingHorizontal: 10,
    color:"white",

  },
  addressLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color:"white",
  },
  addressSelect: {
    width: 200,
    height:50,
    color:"white",
  },
header: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: 'gray',
  },
  header2: {
    flexDirection: 'row',
  },
details: {
    flex: 1,
  },
category: {
    flexDirection: 'row',
  },
priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
  },
inputtext: {
    fontWeight: 'bold',
    height: 40,
    borderColor: 'gray',
    marginBottom: 10,
    color:"white",
  },
  imageandprice:{
    width: '40%',
    left: 10,
    top: 30,
    resizeMode: "contain",
    paddingBottom: 100,
  },
  uploadIcon: {
    position: 'absolute',
    left: 25,
    top: 20,
    margin: 15,
   },
image: {
    // borderColor: 'black',
    width: '200%',
    aspectRatio: 1,
    borderRadius: 15,
    borderWidth: 2,
  },

categoryPicker: {
    flex: 1,
    color:"white",
    fontWeight: 'bold',
  },

//bản mô tả
textInput: {
    height: 100,
    borderWidth: 1,
    borderRadius:5,
    borderColor: 'gray',
    width: '100%',
    color:"white",
  },

inputprice: {
  left: 10,
  padding: 10,
  textAlign: 'center',
  color: 'white',
  borderRadius: 5,
  padding: 10,
  fontWeight: 'bold',
  },
button: {
  left: 10,
  width: 30,
  height: 30,
  borderWidth: 1,
  borderRadius: 10,
  borderColor: 'white',
  // backgroundColor: '#ddd',
  alignItems: 'center',
  justifyContent: 'center'
},
buttonText: {
  fontSize: 15,
  color: 'white',
},
buttonModalView:{
      borderRadius: 30,
      flexDirection:'row',
      // justifyContent: 'center',
      // alignItems: 'center',
      padding:10,
      justifyContent:'space-around',
      backgroundColor:'pink',
  },
modalView:{

      position:'absolute',
      bottom:1,
      width:'100%',
      height:200,
  },
  cancelupload:{
      position:'absolute',
      bottom:50,
      left:100,
      width:'50%',
      height:60,
      backgroundColor:'#778899',
  }
});

export default AddProduct;
