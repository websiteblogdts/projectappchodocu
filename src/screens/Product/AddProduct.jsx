import React, { useState } from 'react';
import { View, Text,Modal,TextInput,TouchableOpacity , Alert,Image } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';
import styles from '../../components/ProductStyles';
import config from '../../config/config';

const AddProduct = () => {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [images, setImages] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  const [modal, setModal] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    fetchCategories();
    fetchProvinces();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.apiBaseURL}/product/category`);
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
        name, price, description, images, category, address: { province: selectedProvince, district: selectedDistrict, ward: selectedWard }
      });
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Error', 'No user token found. Please login again.');
        navigation.navigate('Login');
        return;
      }
      if (isSubmitting) {
        console.log("Submitting data, please wait...");
        return; 
      }
        setIsSubmitting(true);
      const response = await fetch(`${config.apiBaseURL}/product/create`, {
        method: 'POST',
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
      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
       }
      console.log("Data submitted successfully!");
      console.log(data);
      Alert.alert('Success', 'Product added successfully!');
      } catch (error) {
        console.error('Error adding product:', error);
        Alert.alert('Error', error.message || 'Failed to add product');
    }
    finally {
      setIsSubmitting(false);
    }
  };
// const handleSubmit = async () => {
//   try {
//     const productData = {
//       name,
//       price,
//       description,
//       images,
//       category,
//       address: {
//         province: selectedProvince,
//         district: selectedDistrict,
//         ward: selectedWard
//       }
//     };
//     console.log("Sending product data:", productData);
//     const userToken = await AsyncStorage.getItem('userToken');
//     if (!userToken) {
//       Alert.alert('Error', 'No user token found. Please login again.');
//       navigation.navigate('Login');
//       return;
//     }
//     if (isSubmitting) {
//       console.log("Submitting data, please wait...");
//       return;
//     }
//     setIsSubmitting(true);
//     const response = await axios.post('http://appchodocu.ddns.net:3000/product/create', productData, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `${userToken}`
//       }
//     });
//     const data = await response.json(); 
//       if (!response.ok) {
//         throw new Error(data.error || `HTTP error ${response.status}`);
//        }
//       console.log("Data submitted successfully!");
//       console.log(data);
//       Alert.alert('Success', 'Product added successfully!');
//       } catch (error) {
//         console.error('Error adding product:', error);
//         Alert.alert('Error', error.message || 'Failed to add product');
//     }
//     finally {
//       setIsSubmitting(false);
//     }
//   };


  const increasePrice = () => {
    setPrice(prevPrice => Number(prevPrice) + 1); 
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
      // handleUpload(result.assets[0]);
      handleUploadNhieuAnh(result.assets[0]);
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

export default AddProduct;
