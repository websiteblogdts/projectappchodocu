import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#3B3B3B',
  
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
    toggleButton: {
      padding: 10,
      backgroundColor: 'blue',
      borderRadius: 5,
      alignSelf: 'center',
      margin: 10,
    },
    toggleButtonText: {
      color: 'white',
      fontSize: 16,
    }
  
  });
  const gridStyles = StyleSheet.create({
    productContainer: {
      width: 160,
      height: 250,
      backgroundColor: '#B4EEB4',
      borderRadius: 8,
      marginBottom: 10,
      marginHorizontal: 2,
      padding: 5,
      shadowColor: "black", // Màu đổ bóng
      shadowOffset:{width: 1, height: 2,} ,// Khoảng cách đổ bóng theo chiều dọc
      shadowOpacity: 4.25, // Độ mờ của bóng
      shadowRadius: 5.84, // Bán kính của đổ bóng
      elevation: 5, // Sử dụng cho Android để hiển thị đổ bóng
      overflow: 'hidden',
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'center',
    },
    price: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 8,
      textAlign: 'center',
    },
    image: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#EED5B7'
    },
  });
  
  
  //dạng sanh sách ngang
  const listStyles = StyleSheet.create({
    productContainer: {
     flexDirection:'row',
      backgroundColor: '#B4EEB4',
      borderRadius: 25,
      margin: 70,
      padding: 16,
      marginBottom: 15,
      marginHorizontal: 25,
      alignItems: 'center', // Thêm để căn giữa các items theo chiều dọc
      
    },
    nameandprice:{
      right:30,
        flexDirection:'colume',
        justifyContent: "space-around",
        width:"60%",
    },
    imageContainer: {
      elevation: 10, // Sử dụng cho Android để hiển thị đổ bóng
      borderRadius: 40, // Bo góc cho hình ảnh
    },
    name: {
      fontSize: 15,  // Có thể giảm kích thước font nếu cần
      fontWeight: 'bold',
      textAlign: 'left',
      flex: 1, // Thêm để `name` chiếm hết không gian còn lại sau `image`
  
    },
    price: {
      fontSize: 20,  // Giảm kích thước font cho giá
      marginBottom: 10,
      textAlign: 'left',
      fontWeight: 'bold',
  
    },
    image: {
      bottom:45,
      right:37,
      width: 130,
      height: 150,
      borderRadius: 30,
      borderColor: 'black',
    },
  });
  export default styles;
