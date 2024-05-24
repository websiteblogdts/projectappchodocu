const express = require('express');
const router = express.Router();
const vipController = require('../controllers/vipController');

router.post('/upgrade', vipController.upgradeToVip);

router.get('/', vipController.getRoutes); // Test route

module.exports = router;
