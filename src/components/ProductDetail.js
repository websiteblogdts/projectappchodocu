import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      // flexGrow: 1,
      padding: 16,
      borderColor: 'black',
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
    descriptionContainer: {
      maxHeight: 105,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
    },
    imageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 350,
      height: 250,
      
    },
    image: {
      width: '100%',
      height: '100%',
      aspectRatio: 4 / 3,
    },
    imageIndex: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      color: 'blue',
      fontSize: 16,
      fontWeight: 'bold',
    },
    imageIndicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    imageIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    category: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 8,
    },
    address: {
      fontSize: 14,
      marginTop: 4,
      marginBottom: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 16,
    },
    updateButton: {
      marginRight: 8,
    },
  });
  export default styles;