const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', userController.login);

router.use(authMiddleware);

router.get('/', userController.getRoutes);
router.post('/register', userController.register);
router.put('/update', userController.updateUser);
router.get('/profile', userController.getUserProfile);

module.exports = router;
