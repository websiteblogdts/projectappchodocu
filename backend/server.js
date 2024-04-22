const express = require('express');
const mongoose = require('mongoose');
const server = express();
const bodyParSer = require("body-parser");

const authMiddleware = require('./middlewares/authMiddleware');

const productRoutes = require("./routes/productRoutes");
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes'); 


require("./models/Product");
require("./models/Admin");
require("./models/User"); 

server.user = express.json();

const mongURI = "mongodb+srv://appchocu:Gcd191140@appchodocu.qbquqzj.mongodb.net/?retryWrites=true&w=majority&appName=appchodocu";
mongoose.connect(mongURI, { 
});

mongoose.connection.on("connected", () => {
  console.log(`Ket noi thanh cong hehe <3 <3 <3 <3 <3 <3<3 <3 <3<3 <3 <3<3 <3 <3`);
});

mongoose.connection.on("error", (err) => {
  console.log(`Khong the ket noi rui`, err);
});

server.use(bodyParSer.json());

server.use('/product', productRoutes); 
server.use('/admin', adminRoutes); 
server.use("/user", userRoutes); 

server.use(authMiddleware);

server.listen(3000, () => {
  console.log("Listening on 3000");
});