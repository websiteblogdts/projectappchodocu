import { StyleSheet,Dimensions } from 'react-native';
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
    backgroundColor: '#3B3B3B',
  },
  buttonContainer:{
    flexDirection: 'row',
  },
  imageContainer: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  imageIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  imageIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#ccc',
  },
  activeImageIndicator: {
    backgroundColor: '#000',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white', 
  },
  price: {
    fontFamily: 'ConcertOne',
    fontSize: 25,
    color: 'white', 
    marginBottom: 10,
  },
  admin_rejected: {
    // fontFamily: 'ConcertOne',
    fontSize: 20,
    color: 'red', 
    marginBottom: 10,
    backgroundColor:"#414141",
  },
  descriptionContainer: {
    maxHeight: 150, // chỉnh ô mô tả to bé đẩy cái chấm chấm kia lên cao
    marginBottom: 30,

  },
  description: {
    fontSize: 16,
    color: 'white', 
    backgroundColor:"#414141",
    // borderWidth:1,
    // borderColor:"black",
    // 4C4C4C
  },
  category: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white', 
    fontFamily: 'ConcertOne',

  },
  address: {
    fontSize: 16,
    marginBottom: 20,
    color: 'white', 

  },
  sendMessageButton:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    color: 'white', 
  }
});

  export default styles;