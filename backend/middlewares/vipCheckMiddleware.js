const User = require('../models/User');

const vipCheckMiddleware = async (req, res, next) => {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Kiểm tra hạn VIP trước
    if (user.vipExpiryDate && new Date() <= user.vipExpiryDate) {
        return next(); // Nếu người dùng vẫn còn thời hạn VIP hợp lệ
    }

    // Kiểm tra điểm thưởng
    if (user.reward_points < 100) {
        return res.status(400).json({ error: 'Not enough reward points or VIP status expired' });
    }

    // Trừ điểm thưởng nếu không phải VIP
    user.reward_points -= 100;
    await user.save();

    next();
};

module.exports = vipCheckMiddleware;
