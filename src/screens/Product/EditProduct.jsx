import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Button, ActivityIndicator, Image, ScrollView,Alert } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const UpdateProduct = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [modal, setModal] = useState(false);
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = route.params.productId;
        const response = await fetch(`http://appchodocu.ddns.net:3000/product/${productId}`);
        const data = await response.json();
        const provincesData = await fetchProvinces();
        const districtsData = await fetchDistricts(data.address.province);
        const wardsData = await fetchWards(data.address.district);

        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setImage(data.image);
        setUploadedImage(data.image);
        setCategory(data.category);
        // Lấy danh sách tỉnh/thành
        setProvinces(provincesData);
        // Lấy danh sách quận/huyện dựa trên tỉnh/thành đã chọn
        setDistricts(districtsData);
  
        // Lấy danh sách phường/xã dựa trên quận/huyện đã chọn
        setWards(wardsData);

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
          image,
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

  const fetchProvinces = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  };

  const fetchDistricts = async (provinceName) => {
    try {
      const selectedProvince = provinces.find((p) => p.Name === provinceName);
      if (selectedProvince) {
        return selectedProvince.Districts;
      }
      return [];
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  };

  const fetchWards = async (districtName) => {
    try {
      const selectedDistrict = districts.find((d) => d.Name === districtName);
      if (selectedDistrict) {
        return selectedDistrict.Wards;
      }
      return [];
    } catch (error) {
      console.error('Error fetching wards:', error);
      return [];
    }
  };
  const requestExternalWritePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs access to external storage to save images',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
          buttonNeutral: 'Ask Me Later',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('External Write Permission Granted');
        return true;
      } else {
        console.log('External Write Permission Denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const _uploadImage = async () => {
    const isPermissionGranted = await requestExternalWritePermission();
    if (isPermissionGranted) {
      const options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: true,
          path: 'Image',
        },
      };

      ImagePicker.launchImageLibrary(options, (response) => {
        console.log('Response=', response);
        if (response.didCancel) {
          console.log("User cancelled image picker");
          setLoading(false);
        } else if (response.error) {
          console.log("Image Picker Error", response.error);
          setLoading(false);
        } else {
          const { assets } = response;
          if (assets && assets.length > 0) {
            const { fileName, uri, type } = assets[0];
            const source = { name: fileName, uri, type };
            console.log(source);
            handleUpdata(source);
          } else {
            console.log("Error: No assets found in response");
            setLoading(false);
          }        
        }
      })
    }
  }

  const handleProvinceChange = async (province) => {
    setSelectedProvince(province);
    setDistricts(await fetchDistricts(province));
    setWards([]);
    setSelectedDistrict('');
    setSelectedWard('');
  };
  
  const handleDistrictChange = async (district) => {
    setSelectedDistrict(district);
    setWards(await fetchWards(district));
    setSelectedWard('');
  };
  
  const handleWardChange = (ward) => {
    setSelectedWard(ward);
  };

  const handleUpdata = (photo) => {
    const data = new FormData()
    setLoading(true);
    data.append('file',photo)
    data.append("upload_preset","ackgbz0m")
    data.append("cloud_name","dvm8fnczy")
    fetch("https://api.cloudinary.com/v1_1/dvm8fnczy/image/upload",{
        method:'POST',
        body:data,
        headers:{
            'Accept':'application/json',
            'Content-Type':'multipart/form-data'
        }
    }).then(res => res.json())
    .then(data => {
      setImage(data.url)
      setUploadedImage(data.url);
        setModal(false)
        console.log(data)
        setLoading (false)
    }).catch(err => {
        Alert.alert("Error While Uploading")
    })
  }
 
  const _takePhoto = () => {
    const options ={
        title : 'Select Image',
        storageOptions: {
            skipBackup: true,
            path:'Image'
        }
    }
    ImagePicker.launchCamera(options,(response) =>{
        console.log('Response=',response);
        if(response.didCancel){
            console.log("User cancelled image picker");
        }else if(response.error){
            console.log("Image Picker Error",response.error);
        }else{
          const { assets } = response;
          if (assets && assets.length > 0) {
            const { fileName, uri, type } = assets[0];
            const source = { name: fileName, uri, type };
            console.log(source);
            handleUpdata(source);
          } else {
            console.log("Error: No assets found in response");
            setLoading(false);
          }        
        }
    })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Update Product</Text>
          <ActivityIndicator animating={loading} size="large" color="#0000ff" />
          {uploadedImage && (
            <Image source={{ uri: uploadedImage }} style={styles.image} />
          )}
  
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={text => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price.toString()}
            onChangeText={text => setPrice(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={text => setDescription(text)}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={category}
            onChangeText={text => setCategory(text)}
          />
  
          <Picker
            selectedValue={selectedProvince}
            onValueChange={handleProvinceChange}
            style={styles.picker}
          >
            <Picker.Item label="Select Province" value="" />
            {provinces.map((province) => (
              <Picker.Item key={province.id} label={province.Name} value={province.Name} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedDistrict}
            onValueChange={handleDistrictChange}
            style={styles.picker}
          >
            <Picker.Item label="Select District" value="" />
            {districts.map((district) => (
              <Picker.Item key={district.id} label={district.Name} value={district.Name} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedWard}
            onValueChange={handleWardChange}
            style={styles.picker}
          >
            <Picker.Item label="Select Ward" value="" />
            {wards.map((ward) => (
              <Picker.Item key={ward.id} label={ward.Name} value={ward.Name} />
            ))}
          </Picker>
  
          <Button icon="upload" style={styles.button} mode="contained" onPress={() => setModal(true)} title="Upload Image" />
          <Button
            icon="content-save"
            style={styles.button}
            mode="contained"
            onPress={() => updateData()}
            title="Update Product"
          />
  
          <Modal
            animationType='slide'
            transparent={true}
            visible={modal}
            onRequestClose={() => { setModal(false) }}
          >
            <View style={styles.modalView}>
              <View style={styles.buttonModalView}>
                <IconButton icon="camera" onPress={_takePhoto} />
                <IconButton icon="folder-image" onPress={_uploadImage} />
              </View>
              <IconButton icon="cancel" style={styles.modalButton} mode="contained" onPress={() => setModal(false)} />
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      paddingVertical: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: 20,
    },
    input: {
      height: 40,
      width: '80%',
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    picker: {
      height: 50,
      width: '80%',
      marginBottom: 10,
    },
    button: {
      marginTop: 10,
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      marginTop: 200,
    },
    buttonModalView: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: 20,
    },
    modalButton: {
      width: '100%',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 18,
    },
  });
export default UpdateProduct;