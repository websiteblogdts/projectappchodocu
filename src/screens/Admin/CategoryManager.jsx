import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  
      const response = await axios.get('http://appchodocu.ddns.net:3000/admin/allcategory',{
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
      await axios.delete(`http://appchodocu.ddns.net:3000/admin/categories/${id}`, {
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
    await axios.post('http://appchodocu.ddns.net:3000/admin/createcategory', { name: newCategoryName }, {
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
      <Button title="Add Category" onPress={() => setModalVisible(true)} />
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

            <Button title="Save" onPress={addCategory} disabled={!isCategoryNameValid} />

            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <View style={styles.containercategory}>
      {categories.length === 0 ? (
        <Text style={styles.emptyText}>Danh sách trống</Text>
      ) : (
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name}</Text>
            <Button title="Delete" onPress={() => deleteCategory(item._id)} />
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
    marginTop: 50,
  },
  containercategory: {
    flex: 1,
    padding: 16,
    backgroundColor: '#CAE1FF',

  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 6,
    backgroundColor: '#fff',
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
});

export default CategoryManager;