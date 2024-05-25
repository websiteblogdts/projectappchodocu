const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

// router.get('/packages',  paymentController.getPackages);

// Route để tạo đơn hàng PayPal
router.post('/create-payment',  paymentController.createPayment);

// Route để xử lý thanh toán PayPal
router.post('/capture-payment',  paymentController.capturePayment);

router.get('/packages',  paymentController.packages);

router.post('/newpackages',  paymentController.newpackages);

module.exports = router;

