import io from 'socket.io-client';
import config from '../config/config';

const socket = io(config.socketServerURL);

// Lắng nghe sự kiện kết nối thành công
socket.on('connect', () => {
  console.log('Connected to server');
});

// Lắng nghe sự kiện bị ngắt kết nối
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

export default socket;