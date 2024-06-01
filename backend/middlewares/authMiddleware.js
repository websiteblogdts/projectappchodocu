const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
// convert sang cookie để không bị lấy với localstorage qua token. vì cookie dưới dạng httponly chỉ gửi lên sv chứ k lấy đc. 
//tạo thêm 1 con rate limit để chặn reques (ví dụ 10 reques /1s để hạn chế ddos) 
//chặn nhiều reques gửi đến sever (thử lại sau 5p, chặn ip)'
const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authorizationHeader.replace('Bearer ', '');

    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        const refreshToken = req.headers['refresh-token'];
        if (!refreshToken) {
          return res.status(403).json({ message: 'Invalid token' });
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
          }

          const newAccessToken = jwt.sign({ id: decoded.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
          res.setHeader('new-access-token', newAccessToken);

          const user = await User.findById(decoded.id);
          if (!user || user.isDeleted || user.account_status === 'locked') {
            return res.status(401).json({ message: 'User not found or account is locked/deactivated' });
          }

          req.user = user;
          next();
        });
      } else {
        const user = await User.findById(decoded.id);
        if (!user || user.isDeleted || user.account_status === 'locked') {
          return res.status(401).json({ message: 'User not found or account is locked/deactivated' });
        }

        req.user = user;
        next();
      }
    });
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
