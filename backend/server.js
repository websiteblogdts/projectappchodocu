const express = require('express');
const mongoose = require('mongoose');
const server = express();
const bodyParSer = require("body-parser");
const productRoutes = require("./routes/productRoutes");
require("./models/Product");

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

server.use('/product', productRoutes); // Sử dụng route handler sản phẩm

server.listen(3000, () => {
  console.log("Listening on 3000");
});