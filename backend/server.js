//server.js

require('dotenv').config();
// console.log(process.env);
const otpRoutes = require('./routes/otpRoutes');

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const app = express();
const http = require('http');
const cors = require('cors'); // Thêm dòng này

const io = require('../backend/config/socket'); 
io.attach(http.createServer(app));
const authRoutes =  require('./routes/authRoutes');
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
require('./middlewares/passportConfig'); // Đảm bảo import cấu hình passport
// Cấu hình đường dẫn tới thư mục chứa views
app.set('views', './views'); // Đảm bảo đường dẫn này trỏ đến thư mục chứa các file .ejs hoặc .pug

// Thiết lập view engine là ejs
app.set('view engine', 'ejs');

app.use(cors()); // Thêm dòng này để sử dụng middleware CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(config.mongoURI, {
}).then(() => {
  console.log("Kết nối thành công hehe <3");
}).catch(err => {
  console.log("Không thể kết nối rùi", err);
});

// Cấu hình session
app.use(session({
  secret: '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',
  resave: false,
  saveUninitialized: true,
}));

// Khởi tạo Passport.js
app.use(passport.initialize());
app.use(passport.session());


app.use('/otp', otpRoutes);
app.use('/auth', authRoutes);
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
