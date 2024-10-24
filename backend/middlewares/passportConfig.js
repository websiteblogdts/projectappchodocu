const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Import jwt

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.API_BASE_URL + "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Tìm người dùng theo email
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        // Nếu người dùng không tồn tại, tạo một người dùng mới
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar_image: profile.photos[0].value,
          reward_points: 10000, // Điểm mặc định
          role: 'user', // Vai trò mặc định
          account_status: 'active', // Trạng thái tài khoản mặc định
          password: crypto.randomBytes(16).toString('hex'), // Tạo một mật khẩu ngẫu nhiên
        });
        await user.save();
      } else if (!user.googleId) {
        // Nếu người dùng đã tồn tại nhưng không có Google ID, cập nhật người dùng
        user.googleId = profile.id;
        user.avatar_image = profile.photos[0].value; // Cập nhật avatar nếu cần
        await user.save();
      } else if (user.account_status === 'deleted') {
        // Kiểm tra trạng thái tài khoản đã bị xóa
        return done(null, false, { message: 'Account deleted. Please contact support to restore.' });
      } else if (user.account_status !== 'active') {
        // Trạng thái tài khoản không phải là active
        return done(null, false, { message: 'Account not active. Please verify your email or contact support.' });
      }

      // Kiểm tra xem người dùng có số điện thoại không
      if (!user.phone_number) {
        // Chuyển hướng người dùng đến trang để thêm số điện thoại
        return done(null, user, { needPhoneNumber: true });
      }

      // Tạo JWT
      const token = jwt.sign({
        id: user._id,
        role: user.role, // Thêm vai trò người dùng vào token
      }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Đặt thời gian hết hạn cho token

      return done(null, { user, token }); // Trả về user và token
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
