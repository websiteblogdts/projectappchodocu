const User = require('../models/User');

const VIP_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 ngày

exports.upgradeToVip = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cập nhật trạng thái VIP và thời gian hết hạn VIP
        user.vipExpiryDate = new Date(Date.now() + VIP_DURATION); // Tính toán thời gian hết hạn VIP
        await user.save();

        res.status(200).json({ message: 'Account upgraded to VIP', vipExpiryDate: user.vipExpiryDate });
    } catch (error) {
        console.error('Error upgrading to VIP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getRoutes = (req, res) => {
    res.send('test VIP');
};
