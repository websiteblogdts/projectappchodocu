const express = require('express');
const mongoose = require('mongoose');
const server = express();

const http = require('http');
const serversocket = http.createServer(server);
const { Server } = require('socket.io');
const io = new Server(serversocket);

const config = require('./config/config');

const authMiddleware = require('./middlewares/authMiddleware');
const messageRoutes = require('./routes/messageRoutes');
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

require("./models/Product");
require("./models/User");

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

mongoose.connect(config.mongoURI, {
}).then(() => {
  console.log("Kết nối thành công hehe <3");
}).catch(err => {
  console.log("Không thể kết nối rùi", err);
});

server.use('/mess', messageRoutes);
server.use('/product', productRoutes);
server.use('/admin', adminRoutes);
server.use("/user", userRoutes);
server.use(authMiddleware);

io.on('connection', (socket) => {
  console.log('A user connected');
  console.log(`A user connected: ${socket.id}`);

  // Xử lý khi có tin nhắn mới được gửi từ client
  socket.on('sendMessage', async (data) => {
    // Xử lý tin nhắn ở đây
    console.log('Received message from client:', data);
    // Ví dụ: Lưu tin nhắn vào CSDL, sau đó gửi lại cho tất cả client khác
    socket.broadcast.emit('receiveMessage', data);
  });

  // Xử lý khi ngắt kết nối từ client
  socket.on('disconnect', () => {
    console.log('User disconnected');
    console.log(`User disconnected: ${socket.id}`);
  });
});


// Thêm dòng console.log để xác nhận rằng máy chủ Socket.IO đã được tạo thành công và đang lắng nghe kết nối từ các máy khách
console.log('Socket.IO server is running and listening for connections.');


serversocket.listen(config.port, () => {
  console.log(`Listening on ${config.port}`);
});
