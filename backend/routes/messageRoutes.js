const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware'); 




router.post('/newchat', messageController.newChat);
router.post('/sendmess', messageController.sendMess);

// đây là xem nội dung tin nhắn với 1 user được liên kết

router.use(authMiddleware);
// đây là xem list met nhắn với những ai.
router.get('/usersWhoMessaged', authMiddleware,messageController.getUsersWhoMessaged); 
router.get('/messages/:chatId', authMiddleware,messageController.getMessages); 
router.post('/test', authMiddleware, messageController.getRoutes);


module.exports = router;