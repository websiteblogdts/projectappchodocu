// otpController.js
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Để gửi email OTP
const otpGenerator = require('otp-generator');

// Gửi OTP qua email
exports.sendOTP = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Email không tồn tại:', email);
            return { success: false, error: 'Email không tồn tại.' };
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log(`OTP được tạo cho email ${email}: ${otp}`);

        const otpExpiry = Date.now() + 30 * 1000; // OTP expires in 30 seconds
        await User.findOneAndUpdate({ email }, { otp_code: otp, otp_expires_at: otpExpiry });

        // Cấu hình email
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'OTP APP Chodocu',
            text: `Your OTP code is: ${otp}`
        };

        // Gửi email
        await transporter.sendMail(mailOptions);
        console.log('Email gửi thành công đến:', email);
        return { success: true }; // Trả về thành công
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { success: false, error: error.message }; // Trả về lỗi
    }
};

        exports.sendOTPafter = async (req, res) => {
        const email = req.body.email; // Lấy email từ request body
        console.log(`Gọi API sendOTP cho email: ${email}`); // Log email được truyền vào API
    
        try {
            // Kiểm tra xem email có tồn tại không
            const user = await User.findOne({ email });
            if (!user) {
                console.log('Email không tồn tại:', email); // Log khi email không tồn tại
                return res.status(400).json({ success: false, error: 'Email không tồn tại.' });
            }
            console.log('Email tồn tại, tạo mã OTP...');
    
            // Generate OTP
            const otp = otpGenerator.generate(6, {
                digits: true, // Chỉ dùng số
                upperCaseAlphabets: false, // Không dùng chữ cái viết hoa
                lowerCaseAlphabets: false, // Không dùng chữ cái viết thường
                specialChars: false, // Không dùng ký tự đặc biệt
            });
            console.log(`OTP được tạo cho email ${email}: ${otp}`);
    
            const otpExpiry = Date.now() + 30 * 1000; // OTP expires in 30 seconds
            const remainingSeconds = Math.floor((otpExpiry - Date.now()) / 1000);
    
            await User.findOneAndUpdate({ email }, { otp_code: otp, otp_expires_at: otpExpiry });
            console.log(`OTP cho email ${email} là: ${otp}, hết hạn sau ${remainingSeconds} giây`);
    
            // Cấu hình transporter cho email
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
            console.log('Cấu hình xong transporter cho email.');
    
            // Cấu hình nội dung email
            let mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: 'OTP APP Chodocu',
                text: `Your OTP code is: ${otp}`
            };
    
            // Gửi email
            await transporter.sendMail(mailOptions);
            console.log('Email gửi thành công đến:', email); // Log khi email được gửi thành công
            res.status(200).json({ message: `OTP verified successfully sent to mail ${email}` });
            return { success: true }; // Trả về đối tượng thành công
        } catch (error) {
            res.status(500).json({ message: 'send fail', error: err.message });
            return { success: false, error: error.message }; // Trả về lỗi nếu có
            }
        };
 // Xác minh OTP
exports.verifyOTP = async (req, res) => {
    const { otpCode, email } = req.body; // Sử dụng email và otpCode
    console.log(`API verifyOTP được gọi cho email: ${email}, với OTP: ${otpCode}`);

    try {
        const user = await User.findOne({
            email, // Tìm kiếm người dùng theo email
            otp_code: otpCode,
            otp_expires_at: { $gt: Date.now() }, // OTP phải còn thời hạn
        });

        if (!user) {
            console.log('OTP không hợp lệ hoặc đã hết hạn.');
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        console.log('OTP hợp lệ, xác minh thành công.');
        // Đánh dấu đã xác minh OTP
        user.otp_verified = true;
        user.account_status = 'active'; // Kích hoạt tài khoản
        user.otp_code = null; // Xóa OTP sau khi xác minh thành công
        user.otp_expires_at = null;
        const savedUser = await user.save(); // Lưu người dùng
        console.log('User after save:', savedUser);
        return res.status(200).json({ message: "Account verified successfully" });
        
    } catch (err) {
        console.error('Lỗi xác minh OTP:', err.message);
        res.status(500).json({ message: 'OTP verification failed', error: err.message });
    }
};

exports.verifyOtpResetPass = async (email, otpCode) => {
    console.log(`Verifying OTP: ${otpCode} for email: ${email}`);
    // try {
    //     const user = await User.findOne({
    //         email, // Tìm kiếm người dùng theo email
    //         otp_code: otpCode,
    //         otp_expires_at: { $gt: Date.now() }, // OTP phải còn thời hạn
    //     });

    //     if (!user) {
    //         console.log('OTP không hợp lệ hoặc đã hết hạn.');
    //         return res.status(400).json({ message: 'Invalid or expired OTP' });
    //     }
    const user = await User.findOne({
        email: email, // Tìm theo email
        otp_code: otpCode, // So sánh OTP
        otp_expires_at: { $gt: Date.now() }, // OTP còn thời hạn
    });

    // Trả về kết quả xác thực
    return user !== null;
};
