import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#3B3B3B',
    },
    productContainer: {
      width: 160, // chiều rộng cố định
      height: 260, // chiều cao cố định
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
      color: "white",
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 8,
      textAlign: 'center',
      height: 36, // Cố định chiều cao, đủ cho 2 dòng text
      overflow: 'hidden' // Ngăn text vượt quá chiều cao đã định
    },
    price: {
      color: "white",
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 4, // Đảm bảo cách đều từ text tên sản phẩm
    },
    status: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#888', // Màu cho text trạng thái
      marginTop: 5,
    },
    image: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 10, // Bo góc cho hình ảnh
      borderWidth: 2, // Độ dày của viền
      borderColor: '#EED5B7' // Màu sắc của viền
    },
    emptyText: {
      color: "white",
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
    flatListContent: {
      flexGrow: 1,
      // justifyContent: 'center',
    },
  });
  export default styles;
