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

const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

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
    cache.clear();

    res.status(200).json({ message: 'Account upgraded to VIP', vipExpiryDate: user.vipExpiryDate });
};

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

  exports.googleLoginCallback = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication failed" });
    }

    const token = generateAccessToken({ id: req.user._id, email: req.user.email, role: req.user.role });
    const refreshToken = generateRefreshToken({ id: req.user._id, email: req.user.email, role: req.user.role });

    // Save refresh token to the user
    req.user.refreshToken = refreshToken;
    await req.user.save();

    // Trả về JSON giống như đăng nhập thông thường
    if (!req.user.phone_number) {
        return res.status(200).json({
            message: "Login successful. Please add your phone number.",
            needPhoneNumber: true,
            token: token,
            refreshToken: refreshToken,
            role: req.user.role,
            user: {
                _id: req.user._id,
                email: req.user.email,
                name: req.user.name,
                avatar_image: req.user.avatar_image,
                reward_points: req.user.reward_points,
                role: req.user.role,
                account_status: req.user.account_status,
                isDeleted: req.user.isDeleted,
                createdAt: req.user.createdAt,
                updatedAt: req.user.updatedAt
            }
        });
    }

    res.status(200).json({
        message: "Login successful",
        token: token,
        refreshToken: refreshToken,
        role: req.user.role,
        user: {
            _id: req.user._id,
            email: req.user.email,
            phone_number: req.user.phone_number,
            name: req.user.name,
            avatar_image: req.user.avatar_image,
            reward_points: req.user.reward_points,
            role: req.user.role,
            account_status: req.user.account_status,
            isDeleted: req.user.isDeleted,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt
        }
    });
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
            return res.status(401).json({ error: "Invalid credentials" });
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
    const { email, password, phone_number, name, avatar_image, reward_points, otp_verified, account_status } = req.body;

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
            otp_verified,
            password: hashedPassword,
            account_status
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error registering user:", error);
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