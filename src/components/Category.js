import { StyleSheet,Dimensions } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3B3B3B',
    },
    buttonadd: {
      top: 5,
    },
    buttonsaveandclose: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonIcon: {
      marginHorizontal: 30,
    },
    containercategory: {
      flex: 1,
      padding: 16,
      backgroundColor: '#3B3B3B',
    },
  
    emptyText:{
    color: 'white'
    },
  
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      marginVertical: 6,
      backgroundColor: '#414141',
      borderWidth: 1,
      borderColor: '#ddd',
    },
    penvadelete: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      // alignItems: 'center',
      padding: 5,
      marginVertical: 6,
      // backgroundColor: '#414141',
      // borderWidth: 1,
      // borderColor: '#ddd',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: "gray",
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
      // width: '90%'
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: 200,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontWeight: 'bold'
    },
    deletedListItem: {
      // flex: 1,
      flexDirection: 'row',
      backgroundColor: '#f8f8f8',
      padding: 30,
      marginVertical: 6,
      borderRadius: 5
   },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF',
      paddingBottom: 10,
    },
    deletedListItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#C0C0C0',
      padding: 20,
      marginVertical: 4,
      borderRadius: 10,
    },
    deletedItemText: {
      // flex: 1, // makes text take up as much space as it can
      marginRight: 10, // space between text and button
      color: '#333',
    },
    emptyText: {
      color: 'white',
      textAlign: 'center',
      marginTop: 20,
    },
    closeIcon: {
      position: 'absolute', // To position the close icon better
      right: 10,
      top: 10,
    },
  });
  export default styles;