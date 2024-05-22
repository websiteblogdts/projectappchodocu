import io from 'socket.io-client';
import config from '../config/config';

// console.log('Connecting to Socket.io server at:', config.socketServerURL);

const socket = io(config.socketServerURL, {
  transports: ['websocket'], // Đảm bảo sử dụng giao thức WebSocket
  autoConnect: true // Tự động kết nối ngay khi khởi tạo
});
// console.log('Connecting to Socket.io server at:', config.socketServerURL);

// Lắng nghe sự kiện kết nối thành công
socket.on('connect', () => {
  console.log('Connected to server');
});

// Lắng nghe sự kiện bị ngắt kết nối
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Lắng nghe lỗi kết nối
socket.on('connect_error', (error) => {
  console.log('Connection Error:', error);
});

export default socket;
