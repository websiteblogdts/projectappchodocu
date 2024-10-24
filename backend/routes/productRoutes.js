const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const vipCheckMiddleware = require('../middlewares/vipCheckMiddleware');
const validateProductFields = require('../middlewares/validateProductFields');
const cacheMiddleware = require("../middlewares/cacheMiddleware");

router.get('/category/:id',cacheMiddleware(60), categoryController.getCategoryById);
router.get('/category', cacheMiddleware(60),categoryController.getAllCategories);


router.get('/helloson', productController.getRoutes);

router.use(authMiddleware);

router.get('/productlistbyuser',authMiddleware,  productController.getAllProductsByUser);// hiển trị trang status

router.get('/productdaduyet', authMiddleware,  productController.getproductdaduyet);

router.get('/:productId', cacheMiddleware(60), authMiddleware, productController.getProductById);

router.put('/editproduct/:productId',authMiddleware, validateProductFields,vipCheckMiddleware,productController.updateProductById);

router.post('/create', authMiddleware,validateProductFields,vipCheckMiddleware, productController.createProduct);

router.delete('/deleteproduct/:productId',authMiddleware,  productController.deleteProductById);




module.exports = router;
