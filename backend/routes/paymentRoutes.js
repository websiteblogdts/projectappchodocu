const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');
const cacheMiddleware = require("../middlewares/cacheMiddleware");

// router.get('/packages',  paymentController.getPackages);
router.get('/success', paymentController.paymentSuccess);
router.get('/cancel', paymentController.cancelPayment);
// Route để tạo đơn hàng PayPal
router.post('/create-payment',  paymentController.createPayment);

router.get('/packages', cacheMiddleware(60), paymentController.packages);

router.post('/newpackages',  paymentController.newpackages);

module.exports = router;

