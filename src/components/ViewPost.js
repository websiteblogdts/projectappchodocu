import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#3B3B3B',
    },
    buttonshowhide: {
      borderRadius: 10, // Độ bo viền
      paddingVertical: 10, // Khoảng cách dọc
      paddingHorizontal: 20, // Khoảng cách ngang
      fontSize: 16, // Kích thước chữ
    },
    productContainer: {
      // width: 160, 
      // height: 250, 
      backgroundColor: '#FFE4C4',
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
    status: {
      fontSize: 13,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#888', 
    },
    name: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 8,
      flex:1,
    },
    price: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    image: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 10, // Bo góc cho hình ảnh
      borderWidth: 2, // Độ dày của viền
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
    flatListContent: {
      flexGrow: 1,
    },
    approvalButton:  {
      padding: 10,
      backgroundColor: '#4CAF50',
      borderRadius: 15,
      marginTop: 7,
    },
    approveButtonText: {
      backgroundColor: '#4CAF50',
      color: 'white',
      textAlign: 'center',
    },
    unapproveButtonText: {
      backgroundColor: '#FF5733',
      color: 'white',
      textAlign: 'center',
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    }
  });
  export default styles;
