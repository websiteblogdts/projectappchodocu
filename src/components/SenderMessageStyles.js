import { StyleSheet } from 'react-native';

const SenderMessageStyles = StyleSheet.create({
  messageContainer: {
     backgroundColor: '#DCF8C6',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 10,
    maxWidth: '95%',
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: 'row-reverse', // Đảo ngược hướng của flex-direction
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10, // Đổi marginRight thành marginLeft
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
  },
  content: {
    marginTop: 5,
  },
});


export default SenderMessageStyles;
