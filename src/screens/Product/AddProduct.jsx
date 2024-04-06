import React, { useState } from 'react';
import { View, Text,StyleSheet,Modal,TextInput, Button, Alert,ActivityIndicator,Image } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');

  // const [image, setImage] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [modal, setModal] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
 
  React.useEffect(() => {
    fetchProvinces();
  }, []);

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
      const response = await fetch('http://appchodocu.ddns.net:3000/product/createproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
      setMessage('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Failed to add product');
    }
  };

  const requestExternalWritePermission = async () => {
    return true; // Đặt giá trị mặc định là true hoặc loại bỏ hàm này hoàn toàn
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
  const _uploadImage = async () => {
    const isPermissionGranted = await requestExternalWritePermission();
    if (isPermissionGranted) {
      // setLoading(true);
      const options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: true,
          path: 'Image',
        },
      };
     
      ImagePicker.launchImageLibrary(options,(response) =>{
        console.log('Response=',response);
        if(response.didCancel){
          console.log("User cancelled image picker");
          setLoading(false);
        } else if(response.error){
          console.log("Image Picker Error",response.error);
          setloading(false);
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
      <ActivityIndicator animating={loading} size="large" color="#0000ff" />
    
      <Text>Create Product</Text>

      {uploadedImage && (
        <Image source={{ uri: uploadedImage }} style={{ width: 200, height: 200 }} />
      )}

      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, margin: 10 }}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, margin: 10 }}
        placeholder="Price"
        value={price}
        onChangeText={text => setPrice(text)}
      />
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, margin: 10 }}
        placeholder="Description"
        value={description}
        onChangeText={text => setDescription(text)}
      />
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, margin: 10 }}
        placeholder="category"
        value={category}
        onChangeText={text => setCategory(text)}
      />
    <Picker
      selectedValue={selectedProvince}
      onValueChange={handleProvinceChange}
      style={{ height: 50, width: 200 }}
    >
      <Picker.Item label="Select Province" value="" />
      {provinces.map((province) => (
        <Picker.Item key={province.id} label={province.Name} value={province.Name} />
      ))}

    </Picker>

      <Picker
        selectedValue={selectedDistrict}
        onValueChange={handleDistrictChange}
        style={{ height: 50, width: 200 }}
      >
    <Picker.Item label="Select District" value="" />
    {districts && districts.map((district) => (
     <Picker.Item key={district.id} label={district.Name} value={district.Name} />
    ))}
    </Picker>

    <Picker
      selectedValue={selectedWard}
      onValueChange={handleWardChange}
      style={{ height: 50, width: 200 }}
    >
      <Picker.Item label="Select Ward" value="" />
      {wards && wards.map((ward) => (
  <Picker.Item key={ward.id} label={ward.Name} value={ward.Name} />
))}
    </Picker>

      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, margin: 10 }}
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
  container:{
      flex:1
  },
  input:{
      margin:6
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
