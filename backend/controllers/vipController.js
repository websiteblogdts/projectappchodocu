//vipcontroller.js
const User = require('../models/User');

// exports.upgradeToVip = async (data) => {
//     const { userId, package } = data;  // Nhận thêm thông tin về package từ data

//     console.log('UserID received in upgradeToVip:', userId);
//     console.log('Package received:', package);  // Log thông tin gói nhận được

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             console.log('User not found with ID:', userId);  // Thêm log khi không tìm thấy người dùng
//             return { message: 'User not found' };
//         }

        
//         // Tính toán thời gian hết hạn VIP dựa trên gói
//         const vipExpiryDate = new Date(Date.now() + package.duration * 24 * 60 * 60 * 1000);  // duration là số ngày VIP
//         console.log('VIP expiry date calculated:', vipExpiryDate);  // Log thời gian hết hạn VIP

//         user.vipExpiryDate = vipExpiryDate;

//         // Cập nhật điểm (points)
//    // Cập nhật điểm thưởng (reward_points)
//         const newRewardPoints = (user.reward_points || 0) + package.points;  // Sử dụng reward_points thay vì points
//         console.log('User current reward points:', user.reward_points, 'New reward points after upgrade:', newRewardPoints);  // Log điểm trước và sau khi cập nhật
//         user.reward_points = newRewardPoints;

//         // Lưu người dùng
//         await user.save();

//         console.log('VIP upgrade successful. New VIP expiry date:', user.vipExpiryDate, 'New reward points:', user.reward_points);  // Log thành công khi nâng cấp VIP
//         return { message: 'Account upgraded to VIP', vipExpiryDate: user.vipExpiryDate, rewardPoints: user.reward_points };  // Trả về rewardPoints
 
//     } catch (error) {
//         console.error('Error upgrading to VIP:', error);
//         return { message: 'Internal server error' };
//     }
// };
exports.upgradeToVip = async (data) => {
    const { userId, package } = data;  // Nhận thêm thông tin về package từ data

    console.log('UserID received in upgradeToVip:', userId);
    console.log('Package received:', package);  // Log thông tin gói nhận được

    try {
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found with ID:', userId);  // Thêm log khi không tìm thấy người dùng
            return { success: false, message: 'User not found' };  // Trả về success: false
        }

        // Tính toán thời gian hết hạn VIP dựa trên gói
        const vipExpiryDate = new Date(Date.now() + package.duration * 24 * 60 * 60 * 1000);  // duration là số ngày VIP
        console.log('VIP expiry date calculated:', vipExpiryDate);  // Log thời gian hết hạn VIP

        user.vipExpiryDate = vipExpiryDate;

        // Cập nhật điểm thưởng (reward_points)
        const newRewardPoints = (user.reward_points || 0) + package.points;  // Sử dụng reward_points thay vì points
        console.log('User current reward points:', user.reward_points, 'New reward points after upgrade:', newRewardPoints);  // Log điểm trước và sau khi cập nhật
        user.reward_points = newRewardPoints;

        // Lưu người dùng
        await user.save();

        console.log('VIP upgrade successful. New VIP expiry date:', user.vipExpiryDate, 'New reward points:', user.reward_points);  // Log thành công khi nâng cấp VIP
        return { success: true, message: 'Account upgraded to VIP', vipExpiryDate: user.vipExpiryDate, rewardPoints: user.reward_points };  // Trả về success: true
 
    } catch (error) {
        console.error('Error upgrading to VIP:', error);
        return { success: false, message: 'Internal server error' };  // Trả về success: false
    }
};

exports.getRoutes = (req, res) => {
    res.send('test VIP');
};
