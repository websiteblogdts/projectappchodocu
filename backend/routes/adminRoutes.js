const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getRoutes);
router.post('/register', adminController.createAdmin);
router.post('/login', adminController.login);

module.exports = router;
