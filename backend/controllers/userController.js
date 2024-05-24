const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Gcd191140";
const { isValidPassword } = require('../middlewares/validator');

exports.getRoutes = (req, res) => {
    res.send('test user');
};

exports.upgradeToVip = async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.accountStatusVip = true;
    user.vipExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 ngày VIP
    await user.save();

    res.status(200).json({ message: 'Account upgraded to VIP', vipExpiryDate: user.vipExpiryDate });
};

//chỉ lấy id của user đã login
exports.getUserId = async (req, res) => {
    try {
      // Lấy thông tin người dùng từ mã token trong req.user
      const user = await User.findOne({ email: req.user.email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ userId: user.id });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  


//giống detail user nhưng là lấy của user đã login
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
        // const user = await User.findOne({ $or: [{ email: identifier }, { phone_number: identifier }] });
        const user = await User.findOne({ 
            $or: [{ email: identifier }, { phone_number: identifier }],
            //isDeleted: false  // Chỉ tìm những tài khoản chưa bị xóa
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Kiểm tra nếu tài khoản đã bị xóa
        if (user.isDeleted) {
            return res.status(401).json({ error: "This account has been deactivated" });
        }

        // Kiểm tra trạng thái khóa của tài khoản
        if (user.account_status === 'locked') {
            return res.status(403).json({ error: "This account is locked" });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Tạo JWT token
        const token = jwt.sign({
            id: user._id.toString(), // Chuyển đổi _id từ ObjectID sang String
            email: user.email,
            role: user.role
        }, JWT_SECRET, { expiresIn: '1h' }); // Token hết hạn sau 1 giờ
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            role: user.role,
            user: {
                _id: user._id,
                email: user.email,
                phone_number: user.phone_number,
                name: user.name,
                avatar_image: user.avatar_image,
                reward_points: user.reward_points,
                role: user.role,
                account_status: user.account_status,
                isDeleted: user.isDeleted,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
        // res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//chưa vali lại email và phone_number khi đăng ký phải đúng định dạng
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
exports.updateUserPassword = async (req, res) => {
    try {
        // Xác định người dùng từ token
        const userId = req.user.id;

        const { oldPassword, newPassword } = req.body;

        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Kiểm tra xác minh mật khẩu cũ
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect old password" });
        }

        // Validate new password
        if (!isValidPassword(newPassword)) {
            return res.status(400).json({ error: "Password must be at least 6 characters long, Do not contain whitespace and leave blank" });
        }

        // Mã hóa mật khẩu mới trước khi cập nhật
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;

        // Lưu người dùng đã cập nhật vào cơ sở dữ liệu
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating user password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.updateAvatar = async (req, res) => {
    try {
        // Xác định người dùng từ token
        const userId = req.user.id;
        const { newAvatarImage } = req.body;
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.avatar_image = newAvatarImage;

        await user.save();

        res.status(200).json({ message: "Avatar updated successfully" });
    } catch (error) {
        console.error("Error updating user password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


