const express = require('express');
const router = express.Router();
const vipController = require('../controllers/vipController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/upgrade',  vipController.upgradeToVip);


router.get('/', vipController.getRoutes); // Test route

module.exports = router;
