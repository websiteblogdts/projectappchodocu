const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', userController.login);

router.post('/register', userController.register);

router.use(authMiddleware);

router.get('/getid', authMiddleware, userController.getUserId);



router.get('/', userController.getRoutes);
router.put('/update', userController.updateUser);
router.get('/profile',  authMiddleware, userController.getUserProfile);

module.exports = router;
