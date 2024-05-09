import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCategoryNameValid, setIsCategoryNameValid] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [showDeletedCategoriesModal, setShowDeletedCategoriesModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCategories();
  }, [])

    useEffect(() => {
      fetchDeletedCategories();
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcons name="restore" size={30} color="#EA7575" 
        onPress={() => setShowDeletedCategoriesModal(true)}  style={styles.trashButton} />
        ),
    });
  },);

;



useEffect(() => {
  fetchDeletedCategories();
}, []);

const fetchDeletedCategories = async () => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${config.apiBaseURL}/admin/historycategorydelete`, {
        headers: {
            'Authorization': `${userToken}`
        }
    });
    // Check if the response has data and update state accordingly
    if (response.data && response.data.length > 0) {
      setDeletedCategories(response.data);
    } else {
      // Handle the case where response is successful but no data is returned
      setDeletedCategories([]);
      // console.log('No deleted categories found');
    }
  } catch (error) {
    // console.error('Failed to fetch deleted categories:', error);
    // Handle specific error response cases
    if (error.response) {
      // Customize error handling based on status codes or error messages
      if (error.response.status === 404) {
        setDeletedCategories([])
        // Alert.alert('Info', 'No deleted categories found');
      }
    }
  }
};

const fetchCategories = async () => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('Token from AsyncStorage:', userToken);

    const response = await axios.get(`${config.apiBaseURL}/admin/allcategory`, {
      headers: {
        'Authorization': `${userToken}` // Ensure you're using Bearer token if required by your backend
      }
    });
    setCategories(response.data); // Set categories with response data
  } catch (error) {
    // console.error('Failed:', error);
    // Handle specific error response case
    if (error.response) {
      if (error.response.status === 404) {
        // If no categories found, clear the categories state
        setCategories([]); // This ensures UI will not display old categories
        Alert.alert('Info', error.response.data.message); // Display alert with info message
      } else if (error.response.data && error.response.data.error) {
        Alert.alert('Error rui', error.response.data.error);
      }
    }
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
      Alert.alert('Success', 'Category deleted successfully');
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
    Alert.alert("Success", "Add category successfully")
    fetchCategories();  // Refresh the categories list
  } catch (error) {
    // console.error('Failed to add category:', error);
    Alert.alert('Error rui', error.response.data.error);
  }
};
const openUpdateModal = (category) => {
  setSelectedCategory(category);
  setUpdateModalVisible(true);
};

const handleUpdateCategory = async () => {

  try {
    const userToken = await AsyncStorage.getItem('userToken');
    const response = await axios.patch(`${config.apiBaseURL}/admin/categories/edit/${selectedCategory._id}`, { name: newCategoryName }, {
        headers: {
            'Authorization': `${userToken}`
        }
    });

    console.log("Response from server:", response.data);
    Alert.alert("Success", "Category updated successfully");
    setUpdateModalVisible(false);
    fetchCategories();
  } catch (error) {
    // console.error('Failed to update category:', error);
    // Safely accessing error.response
    if (error.response) {
      // Now we can safely access error.response.data
      const errorMessage = error.response.data && error.response.data.error ? error.response.data.error : 'An unexpected error occurred';
      Alert.alert('Error', errorMessage);
    } else {
      // Handle errors that don't have a response (network errors, timeout errors)
      Alert.alert('Error', 'Network error or no response from server');
    }
  }
};

const restoreCategory = async (categoryId) => {
  
  try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await axios.put(`${config.apiBaseURL}/admin/categories/restore/${categoryId}`, {}, {
          headers: {
              'Authorization': `${userToken}`
          }
      });
      console.log("Response from server:", response.data);
      if (response.status === 200) {
          Alert.alert("Success", "Category restored successfully");
          fetchDeletedCategories(); // Refresh the list of deleted categories
          fetchCategories(); // Refresh the list of active categories
      }
  } catch (error) {
      console.error('Failed to restore category:', error);
      Alert.alert('Error', 'Failed to restore category');
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
            maxLength={20}
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
            <View style={styles.penvadelete}>
            <Ionicons name="pencil" size={30} color="#FFCC00" onPress={() => openUpdateModal(item)} />
            <Ionicons name="trash-bin" size={30} color="#EA7575" title="Delete" onPress={() => deleteCategory(item._id)} />
            </View>
          </View>
        )}
      />
      )}
      </View>
      <Modal
    animationType="slide"
    transparent={true}
    visible={updateModalVisible}
    onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setUpdateModalVisible(!updateModalVisible);
    }}
>
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <TextInput
                style={styles.input}
                placeholder="Update Category Name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
            />
            <View style={styles.buttonsaveandclose}>
                <Ionicons name='close-circle' size={30} color="black" onPress={() => setUpdateModalVisible(false)} />
                <Ionicons name='save' size={30} color="black" onPress={handleUpdateCategory} />
            </View>
        </View>
    </View>
</Modal>
<Modal
  animationType="slide"
  transparent={true}
  visible={showDeletedCategoriesModal}
  onRequestClose={() => {
    Alert.alert('Modal has been closed.');
    setShowDeletedCategoriesModal(!showDeletedCategoriesModal);
  }}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text style={styles.modalTitle}>Deleted Categories</Text>
      {deletedCategories.length === 0 ? (
        <Text style={styles.emptyText}>No categories to restore.</Text>
      ) : (
        <FlatList
          data={deletedCategories}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.deletedListItem}>
              <Text style={styles.deletedItemText}>{item.name}</Text>
              <Ionicons name="refresh-circle" size={30} color="#4CAF50" onPress={() => restoreCategory(item._id)} />
            </View>
          )}
        />
      )}
      <Ionicons name='close-circle' size={30} color="black" onPress={() => setShowDeletedCategoriesModal(false)} style={styles.closeIcon} />
    </View>
  </View>
</Modal>


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
  penvadelete: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    padding: 5,
    marginVertical: 6,
    // backgroundColor: '#414141',
    // borderWidth: 1,
    // borderColor: '#ddd',
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
    // width: '90%'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold'
  },
  deletedListItem: {
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 30,
    marginVertical: 6,
    borderRadius: 5
 },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    paddingBottom: 10,
  },
  deletedListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#C0C0C0',
    padding: 20,
    marginVertical: 4,
    borderRadius: 10,
  },
  deletedItemText: {
    // flex: 1, // makes text take up as much space as it can
    marginRight: 10, // space between text and button
    color: '#333',
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  closeIcon: {
    position: 'absolute', // To position the close icon better
    right: 10,
    top: 10,
  },
});

export default CategoryManager;
