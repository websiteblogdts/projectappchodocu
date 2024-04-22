const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', userController.login);

router.get('/', userController.getRoutes); // in ra test user

router.post('/register', userController.register);

router.use(authMiddleware);

router.get('/getid', authMiddleware, userController.getUserId);

router.put('/update',authMiddleware, userController.updateUser); // xây dựng chức năng update pass cũ để update pass mới, xác minh otp nếu cần

router.get('/profile',  authMiddleware, userController.getUserProfile);

module.exports = router;
