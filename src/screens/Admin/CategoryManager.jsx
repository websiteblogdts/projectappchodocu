import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';
import { IconButton } from 'react-native-paper';
const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCategoryNameValid, setIsCategoryNameValid] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Token from AsyncStorage:', userToken);
  
      const response = await axios.get(`${config.apiBaseURL}/admin/allcategory`,{
        headers: {
          'Authorization': `${userToken}` // Ensure you're using Bearer token if required by your backend
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      Alert.alert('Error', 'Failed to fetch categories');
    }
  };

  const deleteCategory = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: async () => {
          try {
            const userToken = await AsyncStorage.getItem('userToken');
            console.log('Token from AsyncStorage:', userToken);
      await axios.delete(`${config.apiBaseURL}/admin/categories/${id}`, {
        headers: {
          'Authorization': `${userToken}` // Correct way to include the token
        }
      });
      fetchCategories(); // Refresh the list after deletion
      } catch (error) {
        console.error('Failed to delete category:', error);
        Alert.alert('Error', 'Failed to delete category');
      }
    }}
  ]
 );
};

const addCategory = async () => {
  try {
    // Retrieve the token from AsyncStorage
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('Token from AsyncStorage:', userToken);

    // Make the POST request to add a new category
    await axios.post(`${config.apiBaseURL}/admin/createcategory`, { name: newCategoryName }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${userToken}`  // Properly formatted Authorization header with Bearer token
      }
    });
    // Close the modal and reset state only if the request is successful
    setModalVisible(false);
    setNewCategoryName('');
    fetchCategories();  // Refresh the categories list
  } catch (error) {
    console.error('Failed to add category:', error);
    Alert.alert('Error', 'Failed to add category');
  }
};
  
  const handleCategoryNameChange = (text) => {
    setNewCategoryName(text);
    setIsCategoryNameValid(text.trim().length > 0);
  };
  
  return (
    <View style={styles.container}>
      <Ionicons name="add-circle" size={50} color="#CB75EA" title="Add Category" style={styles.buttonadd} onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Category Name"
            value={newCategoryName}
            onChangeText={handleCategoryNameChange}
          />
        <View style={styles.buttonsaveandclose}>
          <Ionicons name='close-circle' title="Close" size={30} color="black" style={styles.buttonIcon} onPress={() => setModalVisible(false)} />
          <Ionicons name='save' title="Save" size={30} color="black" style={styles.buttonIcon} onPress={addCategory} disabled={!isCategoryNameValid} />
        </View>

           
          </View>
        </View>
      </Modal>
      <View style={styles.containercategory}>
      {categories.length === 0 ? (
        <Text>Danh sách trống</Text>
      ) : (
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.emptyText}>{item.name}</Text>
            <Ionicons name="trash-bin" size={30} color="#EA7575" title="Delete" onPress={() => deleteCategory(item._id)} />
          </View>
        )}
      />
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B3B3B',
  },
  buttonadd: {
    top: 5,
  },
  buttonsaveandclose: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonIcon: {
    marginHorizontal: 30,
  },
  containercategory: {
    flex: 1,
    padding: 16,
    backgroundColor: '#3B3B3B',

  },
  emptyText:{
color: 'white'
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 6,
    backgroundColor: '#414141',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "gray",
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
});

export default CategoryManager;
