
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Gcd191140';
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

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

