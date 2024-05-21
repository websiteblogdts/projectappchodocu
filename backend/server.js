const express = require('express');
const mongoose = require('mongoose');
const server = express();
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


server.listen(config.port, () => {
  console.log(`Listening on ${config.port}`);
});