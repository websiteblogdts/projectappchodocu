import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, RefreshControl, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config/config';
import socket from '../../config/socket';
import SenderMessageStyles from "../../components/SenderMessageStyles";
import ReceiverMessageStyles from '../../components/ReceiverMessageStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MessagesScreen = ({ route }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState('');
  const flatListRef = useRef();
  const [isMessageEmpty, setIsMessageEmpty] = useState(true);
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Thêm một ref để lưu trữ vị trí cuộn trước đó
  const lastScrollOffset = useRef(0);
  
  // Thêm một hàm để xử lý sự kiện cuộn
  const handleScrollBegin = () => {
    setIsScrolling(true);
  };
  // Thêm một hàm để xử lý sự kiện kết thúc cuộn
const handleScrollEnd = () => {
  setIsScrolling(false);
};

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (loading) return;
    scrollToPosition(scrollPosition);
  }, [scrollPosition, loading]);
  const scrollToPosition = (position) => {
    flatListRef.current.scrollToOffset({ offset: position, animated: true });
  };

  useEffect(() => {
    if (dataLoaded) {
      scrollToBottom();
    }
  }, [dataLoaded]);

  useEffect(() => {
    setIsMessageEmpty(messageInput.trim() === '');
  }, [messageInput]);
  
  
  useEffect(() => {
    markMessagesAsRead(chatId);
  }, []);

  // Thay đổi trong useEffect khi lắng nghe sự kiện 'newMessage'
useEffect(() => {
  socket.on('newMessage', handleMessageReceived);
  return () => {
    socket.off('newMessage', handleMessageReceived);
  };
}, []);

// Thay đổi việc gọi cập nhật tin nhắn mới từ useEffect khi có tin nhắn mới
const handleMessageReceived = (newMessage) => {
  if (!isScrolling) {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }
};

  const fetchMessages = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/mess/messages/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      const data = await response.json();
      setMessages(data.messages); // Cập nhật danh sách tin nhắn
      setCurrentUserId(data.currentUserId); // Cập nhật userId
      setProductName(data.productName); // Cập nhật tên sản phẩm
      setProductPrice(data.productPrice); // Cập nhật giá sản phẩm
      setProductImage(data.productImage); // Cập nhật hình ảnh sản phẩm

    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Đảm bảo refreshing được cập nhật
      setDataLoaded(true);
    }
  };



  const markMessagesAsRead = async (chatId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/mess/markMessagesAsRead`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ chatId })
      });

      const data = await response.json();
      console.log('Mark as read response:', data);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiBaseURL}/mess/sendmess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          chatId: chatId,
          senderId: currentUserId,
          content: messageInput
        })
      });
      const data = await response.json();
      console.log('Sent message:', data); 
      setMessageInput('');
      fetchMessages();
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

//icon cuộn xuống dưới
  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToBottomButton(offsetY > 100 && offsetY < contentHeight - 500); // Hiển thị nút "Xem tin nhắn trước" khi cuộn lên và chưa đến cuối danh sách (ở đây là 500)
  };
  
  const scrollToBottom = () => {
    flatListRef.current.scrollToEnd({ animated: true }); // Cuộn xuống tin nhắn cuối cùng
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#414141" />
      </View>
    );
  }
  

  const renderMessage = ({ item }) => {
  const isSender = item.sender._id === currentUserId;
  const styles = isSender ? SenderMessageStyles : ReceiverMessageStyles;

  return (
    <View >
      <View style={styles.messageContainer}>
        <View style={styles.userContainer}>
          <Image source={{ uri: item.sender.avatar_image }} style={styles.avatar} />
          <View>
        {isSender && (
          <Ionicons 
            name={item.read ? 'eye' : 'eye-off-outline'}
            size={18} 
            color={item.read ? '#BEBEBE' : '#BEBEBE'}
            style={styles.readReceiptIcon}
          />
        )}
      </View>
          <View style={styles.textContainer}>
            <Text style={styles.username}>{item.sender.name}</Text>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        </View>
      </View>
      
    </View>
  );
};

  
return (
  <View style={styles.container}>
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#414141" />
      </View>
    ) : (
      <>
        <View style={styles.productInfoContainer}>
          <Image source={{ uri: productImage }} style={styles.productImage} />
          <View style={styles.productTextContainer}>
            <Text style={styles.productNameText}>Product: {productName}</Text>
            <Text style={styles.productPriceText}>Price: {productPrice}</Text>
          </View>
        </View>
        <FlatList
  ref={flatListRef}
  data={messages}
  keyExtractor={(item) => item._id}
  renderItem={renderMessage}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchMessages} />}
  onScroll={handleScroll} // Gán sự kiện onScroll thành handleScroll
  onScrollBeginDrag={handleScrollBegin}
  onScrollEndDrag={handleScrollEnd}
  onMomentumScrollBegin={handleScrollBegin}
  onMomentumScrollEnd={handleScrollEnd}
  onContentSizeChange={(contentWidth, contentHeight) => {
    if (!isScrolling) {
      setScrollPosition(contentHeight);
    }
  }}
  onLayout={() => {
    if (!isScrolling && dataLoaded) scrollToPosition(scrollPosition);
  }}
/>
      </>
    )}
      <TouchableOpacity
        style={[styles.scrollToBottomButton, { opacity: showScrollToBottomButton ? 1 : 0 }]}
        onPress={() => {
          scrollToPosition(0);
        }}>
        <Ionicons name="arrow-down" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Nhập tin nhắn..."
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons
            name="send"
            size={30}
            color={isMessageEmpty ? 'gray' : '#0099FF'}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#414141',
  },
 
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#009387',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productTextContainer: {
    flex: 1,
  },
  productNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  productPriceText: {
    fontSize: 14,
    color: 'white',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  readReceipt: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  scrollToBottomButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: 'gray',
    borderRadius: 20,
    padding: 10,
  },
});

export default MessagesScreen;
