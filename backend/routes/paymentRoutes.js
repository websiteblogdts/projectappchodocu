const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');
const cacheMiddleware = require("../middlewares/cacheMiddleware");

// router.get('/packages',  paymentController.getPackages);

// Route để tạo đơn hàng PayPal
router.post('/create-payment',  paymentController.createPayment);

// Route để xử lý thanh toán PayPal
router.post('/capture-payment',  paymentController.capturePayment);

router.get('/packages', cacheMiddleware(60), paymentController.packages);

router.post('/newpackages',  paymentController.newpackages);

module.exports = router;

