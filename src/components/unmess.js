import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#414141',
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
    color: 'white',
  },
  unreadMessage: {
    fontWeight: 'bold', // Set font weight to bold for unread messages
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
    color: 'white', // Set default text color
  },
  readMessage: {
    fontWeight: 'normal', // Set font weight to bold for unread messages
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
    color: 'white', // Set default text color
  },
  userContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  productName: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  viewMessages: {
    color: 'gray',
    marginTop: 5,
  },
  noMessagesText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default styles;