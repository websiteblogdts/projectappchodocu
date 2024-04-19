const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.get('/productbyuser', authMiddleware,  productController.getAllProductsByUser);

router.get('/',  productController.getAllProducts);

router.get('/:productId', productController.getProductById);


router.get('/helloson', productController.getRoutes);

router.use(authMiddleware);

router.put('/editproduct/:productId',authMiddleware, productController.updateProductById);

router.post('/create', authMiddleware, productController.createProduct);

router.delete('/deleteproduct/:productId',authMiddleware,  productController.deleteProductById);




module.exports = router;
