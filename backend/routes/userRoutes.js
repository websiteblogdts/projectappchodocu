//userroutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const cacheMiddleware = require("../middlewares/cacheMiddleware");



router.post('/login', userController.login);

router.post('/register', userController.register);

router.post('/forgetpassword', userController.forgetPassword);

router.post('/refresh-token', userController.refreshToken);

router.get('/', cacheMiddleware(60),userController.getRoutes); // in ra test user

router.use(authMiddleware);

// router.put('/upgrade-to-vip', userController.upgradeToVip);

router.get('/getid',cacheMiddleware(60), authMiddleware, userController.getUserId);

router.put('/updatepass',authMiddleware, userController.updateUserPassword); // xây dựng chức năng update pass cũ để update pass mới, xác minh otp nếu cần

router.put('/changeavatar', authMiddleware, userController.updateAvatar);

router.get('/profile',  authMiddleware, userController.getUserProfile);

module.exports = router;
