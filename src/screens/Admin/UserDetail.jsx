import React, { useState, useEffect } from 'react';
import { View,Switch, Alert, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();


  const fetchUserDetails = async () => {
    const { userId } = route.params;
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Token from AsyncStorage:', userToken);
      const response = await fetch(`http://appchodocu.ddns.net:3000/admin/userbyid/${userId}`, {
      headers: {
        'Authorization': `${userToken}` // Ensure you're using Bearer token if required by your backend
      }
    });
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
        setLoading(false);
        return;
      }
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setLoading(false);
    }
  };
 

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
      <View>
      <Text >Email: {user.email}</Text>
      <Text >Phone: {user.phone_number}</Text>
      <Text >Role: {user.role}</Text>
      <Text >account_status: {user.account_status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 10,
  }
});

export default UserDetail;
