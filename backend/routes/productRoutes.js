const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.get('/category/:id', categoryController.getCategoryById);
router.get('/category', categoryController.getAllCategories);


router.get('/',  productController.getAllProducts);

// router.get('/:productId', productController.getProductById);

router.get('/helloson', productController.getRoutes);

router.use(authMiddleware);

router.get('/productlistbyuser', authMiddleware,  productController.getAllProductsByUser);

router.get('/productdaduyet', authMiddleware,  productController.getAllProductsByUserApproved);

router.get('/:productId', authMiddleware, productController.getProductById);

router.put('/editproduct/:productId',authMiddleware, productController.updateProductById);

router.post('/create', authMiddleware, productController.createProduct);

router.delete('/deleteproduct/:productId',authMiddleware,  productController.deleteProductById);




module.exports = router;
