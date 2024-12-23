import { StyleSheet, Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width; // Lấy chiều rộng của màn hình

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#3B3B3B',
    },
    selectImageTextContainer: {
      flexDirection: 'cow', // Ensure the text is displayed inline
      alignItems: 'center', // Center the text vertically
      justifyContent: 'center', // Center the text horizontally
    },
    selectImageText: {
      flexDirection: 'row', // Ensure the text is displayed inline
      color: '#888',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
    uploadedImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      marginHorizontal: 5,
    },
    saveIcon: {
      top: 250,
      left: 25,
    },
    containeraddress: {
      backgroundColor: '#3B3B3B',
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 10,
      paddingHorizontal: 10,
      width: '90%',
      paddingHorizontal: 10,
      color:"#9C9C9C",  
    },
    addressLabel: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
      color:"#9C9C9C",
    },
    addressSelect: {
      width: 200,
      height:50,
      color:"#9C9C9C",
    },
  header: {
      flexDirection: 'row',
      borderRadius: 10,
      backgroundColor: '#3B3B3B',
      paddingHorizontal: 5,
      paddingTop: 5,
    },
    header2: {
      flexDirection: 'row',
    },
  details: {
      flex: 1,
    },
  category: {
      flexDirection: 'row',
    },
  priceContainer: {
      top:40,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      justifyContent: 'space-between', // Đảm bảo các thành phần phân bổ đều

    },
    charCount: {
      color: 'white',
      fontSize: 12,
      position: 'absolute',
    right: 10,
    color: 'gray',
    fontSize: 16,
    },    
  inputtext: {
      fontWeight: 'bold',
      height: 40,
      borderColor: 'gray',
      marginBottom: 10,
      color:"white",
    },
    inputname: {
      fontWeight: 'bold',
      height: 50,
      borderColor: 'gray',
      color:"white",
      right:150,
      // paddingRight: 100,
      borderBottomWidth: 1,
      fontSize:18,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tieude:{
      fontWeight: 'bold',
      fontSize:15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      borderColor: 'gray',
      color:"white",
      right:120,
      color:'white',
      // flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    imageandprice:{
      width: '17%',
      left: 20,
      top: 35,
      resizeMode: "cover",
      paddingBottom: 100,
    },
    uploadIcon: {
      position: 'absolute',
      left: 40,
      top: 90,
     },
  image: {
      width: '450%',
      top:40,
      aspectRatio: 1,
      borderRadius: 15,
      borderWidth: 2,
    },
  categoryPicker: {
      flex: 1,
      color:"#9C9C9C",
      fontWeight: 'bold',
    },
  textInput: {
      height: 100,
      borderWidth: 1,
      borderRadius:5,
      borderColor: 'gray',
      width: '100%',
      color:"#9C9C9C",
    },
  
  inputprice: {
    width: 50,
    top: 180,
    // right: 10,
    textAlign: 'center',
    color: '#9C9C9C',
    borderRadius: 5,
    fontWeight: 'bold',
    },
  button: {
    marginHorizontal: 1,
    width: 30,
    top: 180,
    // right:15,
    height: 30,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#9C9C9C',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 15,
    color: '#9C9C9C',
  },
  buttonModalView:{
        borderRadius: 30,
        flexDirection:'row',
        padding:10,
        justifyContent:'space-around',
        backgroundColor:'pink',
    },
  modalView:{
  
        position:'absolute',
        bottom:1,
        width:'100%',
        height:200,
    },
    cancelupload:{
        position:'absolute',
        bottom:50,
        left:100,
        width:'50%',
        height:60,
        backgroundColor:'#778899',
    },
    scrollContainer: {
      flexDirection: 'row', // Để các items nằm ngang
    },
    // Container cho mỗi ảnh và nút xóa
    imageContainerdelete: {
      width: screenWidth, // Đặt chiều rộng bằng với màn hình để paging hoạt động đúng
      justifyContent: 'center', // Căn giữa ảnh theo chiều dọc
      alignItems: 'center', // Căn giữa ảnh theo chiều ngang
      position: 'relative', // Để nút xóa có thể được đặt tuyệt đối
    },
    // Style cho ảnh
    imagedelete: {
      width: '100%', // Chiều rộng ảnh bằng với container
      height: 205 // Đặt chiều cao cố định cho ảnh, điều chỉnh theo yêu cầu
    },
    // Nút xóa ảnh
    deleteButton: {
      position: 'absolute',
      top: 10,
      right: 10, // Đặt ở góc phải trên cùng
    },
    // Container cho các chỉ báo ảnh
    indicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10, // Thêm padding trên để không dính vào ảnh
    },
    // Chỉ báo cho từng ảnh
    imageIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      margin: 5,
      backgroundColor: '#ccc', // Màu nền mặc định cho chỉ báo
    }
  });
  export default styles;
