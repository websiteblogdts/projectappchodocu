import { io } from "socket.io-client";

const socket = io("http://appchodocu.ddns.net:4000", {
  transports: ['websocket'],
  autoConnect: true 
});

// Lắng nghe sự kiện kết nối thành công
socket.on('connect', () => {
  console.log('Connected to server');
  
  // Send a test event to server
  socket.emit('testEvent', { data: 'Hello from client!' });
});

// Lắng nghe sự kiện bị ngắt kết nối
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Lắng nghe lỗi kết nối
socket.on('connect_error', (error) => {
  // console.error('Connection Error FE:', error.message);
  // console.error('Connection Error FE:', error.stack);
  // console.error('Connection Error FE details:', error);
});

// Listen for test response from server
socket.on('testResponse', (data) => {
  // console.log('Received test response from server:', data);
});

export default socket;
