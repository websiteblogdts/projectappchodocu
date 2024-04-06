const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/helloson', productController.getRoutes);
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProductById);
router.post('/createproduct', productController.createProduct);
router.put('/editproduct/:productId', productController.updateProductById);
router.delete('/deleteproduct/:productId', productController.deleteProductById);

module.exports = router;
