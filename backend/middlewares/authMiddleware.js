// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Load environment variables from .env file
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
// console.log(JWT_SECRET);
//tạo thêm cachemiddle cho việc truy vấn nhanh hơn ( bổ sung sau), thêm invalidate cache, cache.clear sau khi dùng
// convert sang cookie để không bị lấy với localstore qua token. vì cookie dưới dạng httponly chỉ gửi lên sv chứ k lấy đc.
// mã hóa pass hash bổ sung thêm salt để random generated ( đã add )
// thêm chức năng refesh token.
//tạo thêm 1 con rate limit để chặn reques (ví dụ 10 reques /1s để hạn chế ddos)
//chặn nhiều reques gửi đến sever (thử lại sau 5p, chặn ip)
const authMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        // Kiểm tra xem tiêu đề Authorization có chứa token dưới dạng 'Bearer ' không
        if (!authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Invalid authorization header format' });
        }

        // Tách token từ tiêu đề và loại bỏ phần 'Bearer '
        const token = authorizationHeader.replace('Bearer ', '');

        // Xác thực token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Kiểm tra xem người dùng có bị đánh dấu là đã xóa không
        if (user.isDeleted) {
            return res.status(401).json({ message: 'This account has been deactivated' });
        }

        // Kiểm tra trạng thái tài khoản
        if (user.account_status === 'locked') {
            return res.status(403).json({ message: 'This account is locked' });
        }

        req.user = user; // Lưu toàn bộ thông tin người dùng vào req.user
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authMiddleware;
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'Gcd191140';
// const User = require('../models/User');

// const authMiddleware = async (req, res, next) => {
//     try {
//         // Lấy token từ cookie
//         const token = req.cookies.token;

//         if (!token) {
//             return res.status(401).json({ message: 'Authorization token is missing' });
//         }

//         // Xác thực token
//         const decoded = jwt.verify(token, JWT_SECRET);

//         // Tìm người dùng trong cơ sở dữ liệu
//         const user = await User.findById(decoded.id);
//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }

//         // Kiểm tra xem người dùng có bị đánh dấu là đã xóa không
//         if (user.isDeleted) {
//             return res.status(401).json({ message: 'This account has been deactivated' });
//         }

//         // Kiểm tra trạng thái tài khoản
//         if (user.account_status === 'locked') {
//             return res.status(403).json({ message: 'This account is locked' });
//         }

//         req.user = user; // Lưu toàn bộ thông tin người dùng vào req.user
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: 'Authentication failed' });
//     }
// };

// module.exports = authMiddleware;
