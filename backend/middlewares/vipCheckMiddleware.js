const User = require('../models/User');

const vipCheckMiddleware = async (req, res, next) => {
    const userId = req.user._id; // Giả sử user ID được lưu trong req.user từ middleware xác thực
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    if (user.vipExpiryDate && new Date() <= user.vipExpiryDate) {
        return next(); // Nếu người dùng vẫn còn thời hạn VIP hợp lệ
    }

    // Kiểm tra nếu request body trống
    const { name, price, description, images, category, address } = req.body;
    if (!name || !price || !description || !images || !category || !address) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Kiểm tra điểm thưởng
    if (user.reward_points < 100) {
        return res.status(400).json({ error: 'Not enough reward points or VIP status expired' });
    }

    // Nếu đủ điểm thưởng và không bị thiếu trường thông tin, tiếp tục xử lý request
    next();
};

module.exports = vipCheckMiddleware;
