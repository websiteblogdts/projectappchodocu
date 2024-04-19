const Admin = require('../models/Admin');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Gcd191140";
const User = require('../models/User');

const { isValidEmail, isValidPassword, isValidPhoneNumber } = require('../middlewares/validator');


exports.getRoutes = (req, res) => {
    res.send('test admin');
};


exports.getAllUsers = async (req, res) => {
    try {
        // Lấy tất cả người dùng từ cơ sở dữ liệu
        const users = await User.find({});
        
        // Kiểm tra xem có người dùng nào không
        if (users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        // Trả về danh sách người dùng
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Tìm người dùng trong cơ sở dữ liệu bằng ID
        const user = await User.findById(userId);

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Trả về thông tin chi tiết của người dùng
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.updateUserById = async (req, res) => {
    const userId = req.params.userId;
    let updateData = req.body;

    try {
        // Kiểm tra xem có cần mã hóa mật khẩu không
        if (updateData.password) {
            // Mã hóa mật khẩu mới trước khi cập nhật
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        // Cập nhật người dùng trong cơ sở dữ liệu dựa trên ID
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        // Kiểm tra xem người dùng có tồn tại không
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateUserByIdForAdmin = async (req, res) => {
    const userId = req.params.userId;
    const updateData = req.body;

    try {
        // Kiểm tra vai trò của người dùng (chỉ admin mới được phép cập nhật thông tin này)
        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ error: "You are not authorized to perform this action" });
        // }
        // Kiểm tra xem các trường được cập nhật có hợp lệ không có nghĩa là điền thiếu trường nào thì nghĩ chơi đó :))
        // const allowedUpdates = ['email', 'phone_number', 'password', 'role'];
        // const isValidOperation = Object.keys(updateData).every((update) => allowedUpdates.includes(update));
        // if (!isValidOperation) {
        //     return res.status(400).json({ error: "Invalid updates" });
        // }

        // Kiểm tra xem các trường dữ liệu được cập nhật có đúng định dạng hay không
        const isValidOperation = true; // Mặc định là true, chúng ta sẽ kiểm tra từng trường riêng biệt
      
        // if (updateData.email.trim() === '') {
        //     return res.status(400).json({ error: "Email cannot be empty" });
        // }
        // Kiểm tra định dạng email
        if (updateData.email && !isValidEmail(updateData.email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
      
        // Kiểm tra định dạng số điện thoại
        if (updateData.phone_number && !isValidPhoneNumber(updateData.phone_number)) {
            return res.status(400).json({ error: "Invalid phone number format" });
        }
    
         // Kiểm tra định dạng password
         if (updateData.password && !isValidPassword(updateData.password)) {
            return res.status(400).json({ error: "Password must be at least 10 characters long" });
        }
        // Kiểm tra xem có cần mã hóa mật khẩu không
        if (updateData.password) {
            // Mã hóa mật khẩu mới trước khi cập nhật
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        // Cập nhật người dùng trong cơ sở dữ liệu dựa trên ID
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        // Kiểm tra xem người dùng có tồn tại không
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Trả về thông tin người dùng sau khi cập nhật
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.deleteUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Xóa người dùng từ cơ sở dữ liệu dựa trên ID
        const deletedUser = await User.findByIdAndDelete(userId);

        // Kiểm tra xem người dùng có tồn tại không
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Trả về thông báo xác nhận xóa thành công
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
