const express = require('express');
const otpController = require('../controllers/otpController');
const router = express.Router();

// Gửi OTP qua email
router.post('/send-otp', otpController.sendOTP);

router.post('/send-otp-after', otpController.sendOTPafter);
// Xác minh OTP
router.post('/verify-otp', otpController.verifyOTP);

module.exports = router;
