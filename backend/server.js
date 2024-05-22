const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const config = require('./config/config');
const authMiddleware = require('./middlewares/authMiddleware');
const messageRoutes = require('./routes/messageRoutes');
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
require("./models/Product");
require("./models/User");


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://appchodocu.ddns.net:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(config.mongoURI, {
}).then(() => {
  console.log("Kết nối thành công hehe <3");
}).catch(err => {
  console.log("Không thể kết nối rùi", err);
});


app.use('/mess', messageRoutes);
app.use('/product', productRoutes);
app.use('/admin', adminRoutes);
app.use("/user", userRoutes);
app.use(authMiddleware);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('newMessage', (message) => {
    console.log('Received new message from Postman:', message);
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(config.port, () => {
  console.log(`Listening on ${config.port}`);
});
