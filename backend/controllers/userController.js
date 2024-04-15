const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Gcd191140";


exports.getRoutes = (req, res) => {
    res.send('test user');
};

exports.getUserProfile = async (req, res) => {
    try {
      // Lấy thông tin người dùng từ mã token trong req.user
      const user = await User.findOne({ email: req.user.email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
exports.login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        // Tìm người dùng trong cơ sở dữ liệu bằng email hoặc số điện thoại
        const user = await User.findOne({ $or: [{ email: identifier }, { phone_number: identifier }] });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Tạo JWT token
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' }); // Token hết hạn sau 1 giờ

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.register = async (req, res) => {
    const { email, password, phone_number, name, avatar_image, reward_points, otp_verified, account_status } = req.body;

    try {
        // Kiểm tra xem email hoặc số điện thoại đã được sử dụng chưa
        const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] });

        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Phonenumber';
            return res.status(400).json({ error: `${field} already exists` });
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new User({
            email,
            phone_number,
            name,
            avatar_image,
            reward_points,
            otp_verified,
            password: hashedPassword,
            account_status
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error, thông tin trùng lặp" });
    }
};

exports.updateUser = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Kiểm tra xác minh mật khẩu cũ
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect old password" });
        }

        // Mã hóa mật khẩu mới trước khi cập nhật
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;

        // Lưu người dùng đã cập nhật vào cơ sở dữ liệu
        await user.save();

        res.status(200).json({ message: "User updated Password successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
