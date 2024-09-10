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
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
    color: 'white',
  },
  readMessage: {
    fontWeight: 'normal',
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
    color: 'white',
  },
  unreadCount: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#CB75EA',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    // color: 'gray',
  },
  unreadCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
