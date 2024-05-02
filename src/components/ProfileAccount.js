import { StyleSheet } from 'react-native';
import * as Font from 'expo-font';
Font.loadAsync({
  'josefin-sans': require('./../../assets/Inknut_Antiqua/InknutAntiqua-Regular.ttf'),
});
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#414141',
      padding: 20,
    },
    nameandbutton:{
        flexDirection: 'row',
        left: 25,
    },
    uploadIcon:{
      top: 9 ,
      left: 5,
    },
    iconsave:{
      right: 180
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
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 10,
      color:'white'
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
    button: {
      
      backgroundColor: '#0066cc',
      borderRadius: 5,
      padding: 10,
      marginHorizontal: 20,
    },
    buttonsubmit: {
      // backgroundColor: '#0066cc',
      borderRadius: 5,
      padding: 10,
      marginHorizontal: 20,
    },
    buttonText: {
      fontSize: 17,
      color: '#fff',
      textAlign: 'center',
      
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
      fontWeight: 'bold',
      fontFamily: 'josefin-sans',
      fontSize: 16, 
    },
    buttonlogout:{
      flexDirection: 'row',
      backgroundColor: '#FF275B',
      top: 90,
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