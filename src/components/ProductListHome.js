import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      backgroundColor: '#3B3B3B',
    },
    searchInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    priceInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    picker: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      backgroundColor: 'gray',
  },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'center',
    },
    price: {
      fontSize: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
    flatListContent: {
      flexGrow: 1,
    },
    iconlogout: {
      marginRight: 10,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền tối để tạo hiệu ứng mờ
      justifyContent: 'center',
      alignItems: 'center',
  },
  modalContainer: {
      width: '90%',
      backgroundColor: '#3B3B3B',
      borderRadius: 10,
      padding: 20,
      elevation: 5,
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
  },
  label: {
      fontSize: 16,
      marginVertical: 10,
  },
  
  priceInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
  },
  });
  
  const gridStyles = StyleSheet.create({
    productContainer: {
      backgroundColor: '#B4EEB4',
      borderRadius: 8,
      marginBottom: 10,
      marginHorizontal: 2,
      padding: 5,
      shadowColor: "black",
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 5.84,
      elevation: 5,
      overflow: 'hidden',
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'center',
    },
    price: {
      fontSize: 14,
      marginBottom: 8,
      textAlign: 'center',
    },
    image: {
      width: '100%',
      height: '80%',
      borderRadius: 5,
    },
    time: {
      fontSize: 12,
      textAlign: 'center',
      color: 'gray',
    },
    nameandprice: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
  const listStyles = StyleSheet.create({
    productContainer: {
      backgroundColor: '#B4EEB4',
      borderRadius: 8,
      marginBottom: 10,
      padding: 10,
      shadowColor: "black",
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 5.84,
      elevation: 5,
      flexDirection: 'row',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 5,
      marginRight: 10,
    },
    nameandprice: {
      flex: 1,
      justifyContent: 'center',
    },
    time: {
      fontSize: 12,
      color: 'gray',
    },
  });
//dạng sanh sách ngang
// const listStyles = StyleSheet.create({
//   productContainer: {
//    flexDirection:'row',
//     backgroundColor: '#B4EEB4',
//     borderRadius: 25,
//     margin: 30,
//     padding: 16,
//     marginBottom: 15,
//     marginHorizontal: 25,
//   },
//   nameandprice:{
//     right:30,
//       flexDirection:'colume',
//       justifyContent: "space-around",
//       width:"60%",
//   },
//   name: {
//     fontSize: 13,  // Có thể giảm kích thước font nếu cần
//     fontWeight: 'bold',
//     textAlign: 'left',
//     flex: 1, // Thêm để `name` chiếm hết không gian còn lại sau `image`
//   },
//   price: {
//     fontSize: 15,  // Giảm kích thước font cho giá
//     marginBottom: 10,
//     textAlign: 'left',
//     fontWeight: 'bold',
//   },
//   image: {
//     bottom:45,
//     right:37,
//     width: 100,
//     height: 120,
//     borderRadius: 20,
//     borderColor: 'black',
//   },
//     time: {
//     fontSize: 14,
//     color: 'gray',
//   },
// });
  export {styles, gridStyles ,listStyles} ;