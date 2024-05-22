import { StyleSheet } from 'react-native';

const ReceiverMessageStyles = StyleSheet.create({
  messageContainer: {
    // alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 10,
    maxWidth: '95%',
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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

export default ReceiverMessageStyles;
