//usercontroller.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const { isValidPassword } = require('../middlewares/validator');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const cache = require("memory-cache");
// console.log(ACCESS_TOKEN_SECRET);
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { sendOTP, verifyOTP, verifyOtpResetPass } = require('../controllers/otpController'); // Thêm OTP controller

const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
const generateJwt = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
};

exports.googleLogin = async (req, res) => {
    const { token } = req.body;

    console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const userInfo = ticket.getPayload();

        // Kiểm tra xem người dùng đã tồn tại chưa
        let user = await User.findOne({ googleId: userInfo.sub });
        
        if (!user) {
            // Nếu người dùng chưa tồn tại thì kiểm tra email
            user = await User.findOne({ email: userInfo.email });
            if (!user) {
                // Nếu email chưa tồn tại thì tạo mới
                user = new User({
                    googleId: userInfo.sub,
                    email: userInfo.email,
                    name: userInfo.name,
                    avatar_image: userInfo.picture,
                    email_verified: userInfo.email_verified,
                    role: 'user',
                });
                await user.save();
            }
        }

        // Tạo JWT token sau khi xác thực thành công
        const jwtToken = generateJwt(user);
        return res.json({
            message: "Login successful",
            token: jwtToken,
            user
        });

    } catch (error) {
        console.error('Error during Google login:', error);
        return res.status(400).json({ message: "Invalid token" });
    }
};


exports.googleLoginCallback = async (req, res) => {
    try {
      // Lấy thông tin người dùng từ Passport
      const user = req.user; // user được Passport tự động thêm vào request
      const role = user.role; // Role của user
      const userId = user._id;
  
      // Tạo JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET, // Bạn cần có biến môi trường JWT_SECRET
        { expiresIn: '1h' }
      );
  
      // Tạo refreshToken nếu cần
      const refreshToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      // Trả về JSON chứa token và thông tin người dùng
      res.json({
        message: 'Login successful okeyou',
        token: token,
        refreshToken: refreshToken,
        role: role,
        user: user
      });
  
    } catch (error) {
      console.error('Google Login Callback Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

exports.getRoutes = (req, res) => {
    res.send('test user');
};

// exports.upgradeToVip = async (req, res) => {
//     const { userId } = req.body;
//     const user = await User.findById(userId);

//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//     }

//     user.accountStatusVip = true;
//     user.vipExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 ngày VIP
//     await user.save();
//     cache.clear();

//     res.status(200).json({ message: 'Account upgraded to VIP', vipExpiryDate: user.vipExpiryDate });
// };

// Chỉ lấy id của user đã login
exports.getUserId = async (req, res) => {
    try {
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
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone_number: identifier }]
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.isDeleted) {
            return res.status(401).json({ error: "This account has been deactivated" });
        }

        if (user.account_status === 'locked') {
            return res.status(403).json({ error: "This account is locked" });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials,Check that the User or Password is incorrect" });
        }

        const token = generateAccessToken({ id: user._id, email: user.email, role: user.role });
        const refreshToken = generateRefreshToken({ id: user._id, email: user.email, role: user.role });

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            message: "Login successful",
            token,
            refreshToken,
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
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.register = async (req, res) => {
    const { email, password, phone_number, name, avatar_image, reward_points } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] });

        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Phonenumber';
            return res.status(400).json({ error: `${field} already exists` });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            email,
            phone_number,
            name,
            avatar_image,
            reward_points,
            otp_verified: false,
            password: hashedPassword,
            account_status: 'pending', // Tài khoản đang chờ xác nhận OTP
        });

        await newUser.save();

        const otpResult = await sendOTP(email); // Gọi hàm sendOTP

        if (!otpResult.success) {
            // Nếu gửi OTP thất bại, trả về lỗi
            return res.status(500).json({ message: "User registered, but OTP sending failed", error: otpResult.error });
        }

        res.status(201).json({ message: "User registered successfully, OTP sent", userId: newUser._id });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.forgetPassword = async (req, res) => {
    console.log("Request body received:", req.body); // Log toàn bộ request body

    const { email, newPassword, otpCode } = req.body;

    // Kiểm tra xem tất cả các thông tin cần thiết có được cung cấp không
    if (!email || !newPassword || !otpCode) {
        console.log("Missing required fields:", { email, newPassword, otpCode });
        return res.status(400).json({ error: "Email, newPassword, and otpCode are required" });
    }

    try {
        console.log(`Searching for user with email: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found with email: ${email}`);
            return res.status(404).json({ error: "User not found" });
        }

        console.log(`User found: ${user.email}. Verifying OTP: ${otpCode}`);
        const isOtpValid = await verifyOtpResetPass(email, otpCode); // Gọi hàm verifyOTP để kiểm tra mã OTP

        if (!isOtpValid) {
            console.log(`Invalid OTP or OTP expired for email: ${email}, OTP: ${otpCode}`);
            return res.status(401).json({ error: "Invalid OTP or OTP expired" });
        }

        console.log(`OTP is valid for email: ${email}. Checking new password validity`);
        if (!isValidPassword(newPassword)) {
            console.log(`Invalid new password: ${newPassword}`);
            return res.status(400).json({ error: "Password must be at least 6 characters long, do not contain whitespace, and leave blank" });
        }

        console.log(`Password is valid. Hashing new password for user: ${email}`);
        const hashedNewPassword = await hashPassword(newPassword);
        user.password = hashedNewPassword;

        console.log(`Saving new password for user: ${email}`);
        await user.save();
        console.log(user)
        cache.clear(); // Xóa cache nếu cần

        console.log(`Password reset successfully for user: ${email}`);
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.updateUserPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await comparePassword(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect old password" });
        }

        if (!isValidPassword(newPassword)) {
            return res.status(400).json({ error: "Password must be at least 6 characters long, Do not contain whitespace and leave blank" });
        }

        const hashedNewPassword = await hashPassword(newPassword);
        user.password = hashedNewPassword;

        await user.save();
        cache.clear();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating user password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateAvatar = async (req, res) => {
    try {
        const userId = req.user.id;
        const { newAvatarImage } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.avatar_image = newAvatarImage;

        await user.save();
        cache.clear();

        res.status(200).json({ message: "Avatar updated successfully" });
    } catch (error) {
        console.error("Error updating user password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is missing' });
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.status(200).json({ token: newAccessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};