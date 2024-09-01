// Filters.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Filters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedAddress,
  setSelectedAddress,
}) => {
  return (
    <View style={styles.filtersContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="All Categories" value="" />
        <Picker.Item label="Category 1" value="category1" />
        <Picker.Item label="Category 2" value="category2" />
        {/* Add more categories as needed */}
      </Picker>
      <View style={styles.priceContainer}>
        <TextInput
          style={styles.priceInput}
          placeholder="Min Price"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={setMinPrice}
        />
        <TextInput
          style={styles.priceInput}
          placeholder="Max Price"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={setMaxPrice}
        />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Address"
        value={selectedAddress}
        onChangeText={setSelectedAddress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  picker: {
    height: 50,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    width: '48%',
  },
});

export default Filters;
