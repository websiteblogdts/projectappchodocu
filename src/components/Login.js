import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      backgroundColor: "gray",
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 10,
      color:'white'
    },
    heading: {
      fontSize: 24,
      marginBottom: 20,
    },
  
    button: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
    registerText: {
      marginTop: 20,
      color: 'blue',
    },
    logoContainer: {
      marginTop: 20,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 250,
      height: 220,
      borderRadius: 60,
    },
    loginText: {
      // width: 250,
      // height: 220,
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 10,
      color:'blue'
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 10,
      
    },
    input: {
      color:'white',
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    icon: {
      marginRight: 5, // Điều chỉnh khoảng cách giữa icon và TextInput
    },
    forgotPassword: {
      color: '#AD40AF',
      marginTop: 10,
      fontSize: 16,
      fontWeight: '700',
    }
  });
  export default styles;  