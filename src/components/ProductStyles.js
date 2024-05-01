import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
  
      backgroundColor: '#707070',
    },
    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    uploadedImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      marginHorizontal: 5,
    },
    saveIcon: {
      top: 30,
      left: 25,
    },
    containeraddress: {
      backgroundColor: '#898989',
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 10,
      paddingHorizontal: 10,
      width: '90%',
      paddingHorizontal: 10,
      color:"white",
  
    },
    addressLabel: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
      color:"white",
    },
    addressSelect: {
      width: 200,
      height:50,
      color:"white",
    },
  header: {
      flexDirection: 'row',
      borderRadius: 10,
      backgroundColor: 'gray',
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
      flexDirection: 'row',
      alignItems: 'center',
      // marginBottom: 10,
    },
  inputtext: {
      fontWeight: 'bold',
      height: 40,
      borderColor: 'gray',
      marginBottom: 10,
      color:"white",
    },
    imageandprice:{
      width: '40%',
      left: 10,
      top: 30,
      resizeMode: "cover",
      paddingBottom: 100,
    },
    uploadIcon: {
      position: 'absolute',
      left: 25,
      top: 20,
      margin: 15,
     },
  image: {
      // borderColor: 'black',
      width: '200%',
      aspectRatio: 1,
      borderRadius: 15,
      borderWidth: 2,
    },
  
  categoryPicker: {
      flex: 1,
      color:"white",
      fontWeight: 'bold',
    },
  
  //bản mô tả
  textInput: {
      height: 100,
      borderWidth: 1,
      borderRadius:5,
      borderColor: 'gray',
      width: '100%',
      color:"white",
    },
  
  inputprice: {
    left: 10,
    padding: 10,
    textAlign: 'center',
    color: 'white',
    borderRadius: 5,
    padding: 10,
    fontWeight: 'bold',
    },
  button: {
    left: 10,
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    // backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
  },
  buttonModalView:{
        borderRadius: 30,
        flexDirection:'row',
        // justifyContent: 'center',
        // alignItems: 'center',
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
    }
  });
  export default styles;
