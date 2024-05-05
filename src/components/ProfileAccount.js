import { StyleSheet } from 'react-native';
import * as Font from 'expo-font';
Font.loadAsync({
  'GreatVibes': require('./../../assets/fonts/GreatVibes-Regular.ttf'),
  'Honk': require('./../../assets/fonts/Honk-Regular-VariableFont_MORF,SHLN.ttf'),
  'BlackOpsOne': require('./../../assets/fonts/BlackOpsOne-Regular.ttf'),
  'BungeeShade': require('./../../assets/fonts/BungeeShade-Regular.ttf'),
  'ConcertOne': require('./../../assets/fonts/ConcertOne-Regular.ttf'), 
 
});
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#414141',
      padding: 20,
    },
    name: {
      fontSize: 20,
      marginTop: 10,
      right: 10,
      color:'white',
      textAlign: 'center',
      // fontWeight: 'bold',
      fontFamily: 'BlackOpsOne',
    },
    nameandbutton:{
        flexDirection: 'row',
        left: 25,
    },
    uploadIcon:{
      top: 9 ,
      left: 5,
    },
    reward_points:{
      fontSize: 20,
      marginTop: 10,
      right: 10,
      color:'pink',
      textAlign: 'center',
      // fontWeight: 'bold',
      fontFamily: 'ConcertOne',
    },
    iconvatextsave:{
    flexDirection: 'row',
    },
    iconsave:{
      left: 150 ,
      bottom: 150
    },
    texticonsave:{
      left: 140 ,
      bottom: 140,
      color: 'white',
      fontWeight: 'bold',
    },
    coverImage: {
      height: 200,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    avatarContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
   
    content: {
      marginTop: 20,
    },
    infoContainer: {
      marginTop: 20,
    },
    infoLabel: {
      color: 'white',
      fontWeight: 'bold',
    },
    infoValue: {
      color: 'white',
      marginTop: 5,
    },
    textInput: {
    height: '50%',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    width: '100%',
    color: "#9C9C9C",
    },
    buttonText: {
      fontSize: 17,
      color: '#fff',
      textAlign: 'center',
      // bottom:200,
    },
    button: {
      // backgroundColor: 'gray',
      bottom: 160,
      borderRadius: 15,
      color: '#fff',
      textAlign: 'center',
      borderColor: 'gray', // Thay 'blue' bằng màu bạn muốn
      borderWidth: 1,
      padding: 10,
      // marginHorizontal: 20,
    },
    buttonsubmit: {
      // backgroundColor: '#0066cc',
      borderRadius: 5,
      padding: 10,
      marginHorizontal: 20,
    },
   
    iconlogout:{
      bottom: 7,
    },
    buttonTextlogout: {
      left: 15,
      flex: 1,
      fontSize: 20,
      color: '#fff',
      textAlign: 'center',
      // fontWeight: 'bold',
      fontFamily: 'ConcertOne',
      fontSize: 16, 
    },
    buttonlogout:{
      flexDirection: 'row',
      backgroundColor: '#FF275B',
      bottom: 145,
      // top: 90,
      borderRadius: 25,
      padding: 20,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'pink',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonClose: {
      backgroundColor: '#414141',
    },
   
    buttonsubmit2: {
      backgroundColor: 'gray',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    input: {
      
      width: '80%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
      marginBottom: 10,
    }, 
    submitandcancel : {
      flexDirection: 'row',
    },
    input: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
    }
  });
export default styles;  