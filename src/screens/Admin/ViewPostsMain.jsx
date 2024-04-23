import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl, Dimensions, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ViewPostsMain = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [approved, setApproved] = useState(false); // false means unapproved, true means approved
  const numColumns = 2;

  useEffect(() => {
    fetchProducts(approved);
  }, [approved]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts(approved);
    });
    return unsubscribe;
  }, [navigation, approved]);

  const fetchProducts = async (approved) => {
    try {
      const endpoint = approved ? 'approved=true' : 'approved=false';
      const response = await fetch(`http://appchodocu.ddns.net:3000/admin/products/?${endpoint}`);
      const data = await response.json();
      setProducts(data);
      console.log("Fetched products:", data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(approved).then(() => setRefreshing(false));
  };

  const navigateToProductDetail = (productId) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const toggleApproved = () => {

    setApproved(!approved);
  };

  const renderProduct = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 32 - 16) / numColumns;
    return (
      <TouchableOpacity onPress={() => navigateToProductDetail(item._id)}>
        <View style={[styles.productContainer, { width: itemWidth }]}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price}</Text>
          {item.image && 
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="contain"
            />
          }
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Button title={approved ? "Show Unapproved" : "Show Approved"} onPress={toggleApproved} />
      {products.length === 0 ? (
        <Text style={styles.emptyText}>Danh sách trống</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.flatListContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E6E6E6',
  },
  productContainer: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    marginBottom: 15,
    marginHorizontal: 2,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContent: {
    flexGrow: 1,
  },
});

export default ViewPostsMain;
