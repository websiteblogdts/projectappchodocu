import React, { useState, useEffect } from 'react';
import { View, Text, TextInput,  FlatList, Modal, Alert ,Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';
import styles from '../../components/Category';
import Swal from 'sweetalert2';

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


// useEffect(() => {
//   fetchDeletedCategories();
// }, []);

const fetchDeletedCategories = async () => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${config.apiBaseURL}/admin/historycategorydelete`, {
        headers: {
            'Authorization': `Bearer ${userToken}`
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
        'Authorization': `Bearer ${userToken}` // Ensure you're using Bearer token if required by your backend
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
  const confirmMessage = 'Are you sure you want to delete this category?';

  if (Platform.OS === 'web') {
    Swal.fire({
      title: 'Confirm Deletion',
      text: confirmMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        performCategoryDeletion(id);
      }
    });
  } else {
    Alert.alert(
      "Confirm Deletion",
      confirmMessage,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", onPress: async () => {
            performCategoryDeletion(id);
          }
        }
      ]
    );
  }
};

const performCategoryDeletion = async (id) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    await axios.delete(`${config.apiBaseURL}/admin/categories/${id}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    Alert.alert('Success', 'Category deleted successfully');
    fetchCategories();
  } catch (error) {
    console.error('Failed to delete category:', error);
    Alert.alert('Error', 'Failed to delete category');
  }
};
const addCategory = async () => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    
    if (Platform.OS === 'web') {
      setModalVisible(false)
      Swal.fire({
        title: 'Confirm',
        text: 'Are you sure you want to add this category?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await performCategoryAddition(userToken);
        }
      });
    } else {
      Alert.alert(
        'Confirm',
        'Are you sure you want to add this category?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add',
            onPress: async () => {
              await performCategoryAddition(userToken);
            }
          }
        ],
        { cancelable: false }
      );
    }
  } catch (error) {
    console.error('Failed to add category:', error);
    if (Platform.OS === 'web') {
      Swal.fire('Error', 'Failed to add category', 'error');
    } else {
      Alert.alert('Error', 'Failed to add category');
    }
  }
};

const performCategoryAddition = async (userToken) => {
  await axios.post(`${config.apiBaseURL}/admin/createcategory`, { name: newCategoryName }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    }
  });
  setModalVisible(false);
  setNewCategoryName('');
  if (Platform.OS === 'web') {
    Swal.fire('Success', 'Category added successfully', 'success');
  } else {
    Alert.alert('Success', 'Category added successfully');
  }
  fetchCategories();
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
        'Authorization': `Bearer ${userToken}`
      }
    });

    console.log("Response from server:", response.data);
    if (Platform.OS === 'web') {
      setUpdateModalVisible(false)
      await Swal.fire('Success', 'Category updated successfully', 'success');
    } else {
      Alert.alert('Success', 'Category updated successfully');
    }
    setModalVisible(false)
    fetchCategories();
  } catch (error) {
    if (Platform.OS === 'web') {
      setUpdateModalVisible(false)
      if (error.response) {
        const errorMessage = error.response.data && error.response.data.error ? error.response.data.error : 'An unexpected error occurred';
        await Swal.fire('Error', errorMessage, 'error');
      } else {
        await Swal.fire('Error', 'Network error or no response from server', 'error');
      }
    } else {
      if (error.response) {
        const errorMessage = error.response.data && error.response.data.error ? error.response.data.error : 'An unexpected error occurred';
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', 'Network error or no response from server');
      }
    }
  }
};

const restoreCategory = async (categoryId) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    const response = await axios.put(`${config.apiBaseURL}/admin/categories/restore/${categoryId}`, {}, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    if (response.status === 200) {
      if (Platform.OS === 'web') {
        setShowDeletedCategoriesModal(false)
        await Swal.fire('Success', 'Category restored successfully', 'success');
      } else {
        Alert.alert('Success', 'Category restored successfully');
      }
      fetchDeletedCategories();
      fetchCategories();
    }
  } catch (error) {
    if (Platform.OS === 'web') {
      setShowDeletedCategoriesModal(false)
      await Swal.fire('Error', 'Failed to restore category', 'error');
    } else {
      Alert.alert('Error', 'Failed to restore category');
    }
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

export default CategoryManager;
