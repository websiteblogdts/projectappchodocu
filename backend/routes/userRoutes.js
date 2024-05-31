const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const cacheMiddleware = require("../middlewares/cacheMiddleware");
const refreshAccessToken = require('../middlewares/refreshAccessToken');


router.post('/login', userController.login);

router.post('/register', userController.register);

router.post('/refresh-token', refreshAccessToken, userController.refreshToken);

router.get('/', cacheMiddleware(60),userController.getRoutes); // in ra test user

router.use(authMiddleware);

router.put('/upgrade-to-vip', userController.upgradeToVip);

router.get('/getid',cacheMiddleware(60), authMiddleware, userController.getUserId);

router.put('/updatepass',authMiddleware, userController.updateUserPassword); // xây dựng chức năng update pass cũ để update pass mới, xác minh otp nếu cần

router.put('/changeavatar', authMiddleware, userController.updateAvatar);

router.get('/profile', cacheMiddleware(60), authMiddleware, userController.getUserProfile);

module.exports = router;
