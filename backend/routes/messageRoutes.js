const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const cacheMiddleware = require("../middlewares/cacheMiddleware");

// Middleware xác thực
router.use(authMiddleware);

// Gọi các hàm xử lý từ messageController và truyền biến "io" vào
router.post('/newchat', messageController.newChat);
router.post('/sendmess', messageController.sendMess);
router.get('/messages/:chatId',cacheMiddleware(60), messageController.getMessages);
router.get('/usersWhoMessaged',cacheMiddleware(60), messageController.getUsersWhoMessaged);
router.put('/markMessagesAsRead',authMiddleware, messageController.markMessagesAsRead);

module.exports = router;
