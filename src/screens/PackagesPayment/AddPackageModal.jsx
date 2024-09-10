import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';

const AddPackageModal = ({ visible, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [points, setPoints] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleSave = () => {
    onSave({ name, description, price, duration, points });
    setName('');
    setDescription('');
    setPrice('');
    setDuration('');
    setPoints('');
    setSelectedType('');
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      autoFocus={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Package</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={text => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={text => setDescription(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            onChangeText={text => setPrice(text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Duration (days)"
            value={duration}
            onChangeText={text => setDuration(text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Points"
            value={points}
            onChangeText={text => setPoints(text)}
            keyboardType="numeric"
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'pink',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default AddPackageModal;
