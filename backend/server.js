require('dotenv').config();
// console.log(process.env);

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const io = require('../backend/config/socket'); 
io.attach(http.createServer(app));

const config = require('./config/config');
const authMiddleware = require('./middlewares/authMiddleware');
const messageRoutes = require('./routes/messageRoutes');
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const vipRoutes = require('./routes/vipRoutes');
require("./models/Product");
require("./models/User");

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
app.use('/payments', paymentRoutes);
app.use('/vip', vipRoutes);
app.use(authMiddleware);

app.listen(config.port, () => {
  console.log(`Listening on ${config.port}`);
});
