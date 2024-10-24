import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import config from '../../config/config';
import Swal from 'sweetalert2';

const AddPackage = ({ visible, onClose, onPackageAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [points, setPoints] = useState('');

  // Check if all required fields are filled and valid
  const isFormValid = () => {
    const isPriceValid = !isNaN(price) && price > 0;
    const isDurationValid = !isNaN(duration) && duration > 0;
    const isPointsValid = !isNaN(points) && points >= 0; // Assuming reward points can't be negative

    return (
      name.trim() !== '' &&
      description.trim() !== '' &&
      isPriceValid &&
      isDurationValid &&
      isPointsValid
    );
  };

  const handleSubmit = async () => {
    // Kiểm tra tính hợp lệ của các trường nhập
    if (!isFormValid()) 
    {
      onClose();

      if (Platform.OS === 'web') {
        Swal.fire({
          title: 'Error',
          text: 'Please fill in all required fields with valid values.',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK',
        });
      } else {
        Alert.alert('Error', 'Please fill in all required fields with valid values.');
      }
      return;
    }
  
    // Xác nhận trước khi gửi
    const confirmMessage = 'Are you sure you want to add this package?';
    onClose();
  
    if (Platform.OS === 'web') {
      Swal.fire({
        title: 'Confirm',
        text: confirmMessage,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await createNewPackage();
        }
      });
    } else {
      Alert.alert(
        'Confirm',
        confirmMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add',
            onPress: async () => {
              await createNewPackage();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };
  
  const createNewPackage = async () => {
    try {
      const response = await fetch(`${config.apiBaseURL}/payments/newpackages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          duration: parseInt(duration),
          points: parseInt(points),
        }),
      });
  
      if (response.ok) {
        // Nếu bạn cần dữ liệu trả về, hãy thêm dòng này
        const result = await response.json(); 
  
        // Hiển thị thông báo thành công
        if (Platform.OS === 'web') {
          Swal.fire({
            title: 'Success',
            text: 'Package added successfully!',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          });
        } else {
          Alert.alert('Success', 'Package added successfully!');
        }
  
        onPackageAdded(); // Callback để refresh packages
        resetForm();
        onClose(); // Đóng modal
      } else {
        const errorResponse = await response.json();
        if (Platform.OS === 'web') {
          Swal.fire({
            title: 'Error',
            text: errorResponse.message || 'Failed to add package',
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK',
          });
        } else {
          Alert.alert('Error', errorResponse.message || 'Failed to add package');
        }
      }
    } catch (error) {
      console.error('Error adding package:', error);
      if (Platform.OS === 'web') {
        Swal.fire({
          title: 'Error',
          text: 'Failed to add package',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK',
        });
      } else {
        Alert.alert('Error', 'Failed to add package');
      }
    }
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setDuration('');
    setPoints('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add Package</Text>
          <TextInput
            style={styles.input}
            placeholder="Package Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            keyboardType="numeric"
            onChangeText={setPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Duration (days)"
            value={duration}
            keyboardType="numeric"
            onChangeText={setDuration}
          />
          <TextInput
            style={styles.input}
            placeholder="Reward Points"
            value={points}
            keyboardType="numeric"
            onChangeText={setPoints}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Package</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    width: '100%',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  buttonClose: {
    backgroundColor: '#EA7575',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default AddPackage;
