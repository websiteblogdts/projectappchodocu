const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Middleware xác thực
router.use(authMiddleware);

// Gọi các hàm xử lý từ messageController và truyền biến "io" vào
router.post('/newchat', messageController.newChat);
router.post('/sendmess', messageController.sendMess);
router.get('/messages/:chatId', messageController.getMessages);
router.get('/usersWhoMessaged', messageController.getUsersWhoMessaged);

module.exports = router;
