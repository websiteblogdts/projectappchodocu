const express = require('express');
const mongoose = require('mongoose');
const server = express();
// const bodyParSer = require("body-parser");
const config = require('./config/config');

const authMiddleware = require('./middlewares/authMiddleware');

const productRoutes = require("./routes/productRoutes");
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes'); 

// require('dotenv').config();

require("./models/Product");
require("./models/User"); 

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// server.use(bodyParSer.json());

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Kết nối thành công hehe <3");
}).catch(err => {
  console.log("Không thể kết nối rùi", err);
});


server.use('/product', productRoutes); 
server.use('/admin', adminRoutes); 
server.use("/user", userRoutes); 
server.use(authMiddleware);


server.listen(config.port, () => {
  console.log(`Listening on ${config.port}`);
});