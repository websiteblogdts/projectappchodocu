const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const vipCheckMiddleware = require('../middlewares/vipCheckMiddleware');
const validateProductFields = require('../middlewares/validateProductFields');

router.get('/category/:id', categoryController.getCategoryById);
router.get('/category', categoryController.getAllCategories);


router.get('/helloson', productController.getRoutes);

router.use(authMiddleware);

router.get('/productlistbyuser', authMiddleware,  productController.getAllProductsByUser);// hiển trị trang status

router.get('/productdaduyet', authMiddleware,  productController.getproductdaduyet);

router.get('/:productId', authMiddleware, productController.getProductById);

router.put('/editproduct/:productId',authMiddleware, validateProductFields,vipCheckMiddleware,productController.updateProductById);

router.post('/create', authMiddleware,validateProductFields,vipCheckMiddleware, productController.createProduct);

router.delete('/deleteproduct/:productId',authMiddleware,  productController.deleteProductById);




module.exports = router;
