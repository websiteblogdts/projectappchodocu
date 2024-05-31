const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const cacheMiddleware = require("../middlewares/cacheMiddleware");


router.use(authMiddleware);
// Quản lý user cho admin
router.get('/getalluser',cacheMiddleware(60), authMiddleware, adminController.getAllUsers);
router.get('/userbyid/:userId', cacheMiddleware(60),authMiddleware, adminController.getUserById);
router.put('/edituser/:userId',  authMiddleware, adminController.updateUserByIdForAdmin);
router.delete('/user/delete/:userId', authMiddleware, adminController.deleteUserById);
router.put('/changstatusaccount/:userId', authMiddleware, adminController.changeStatusAccount);
//quản lý product cho admin
router.put('/product/:productId/approved',cacheMiddleware(60),authMiddleware, adminController.updateApprovedStatus);

router.get('/products',cacheMiddleware(300), authMiddleware, adminController.getProductsByApprovalStatus);
//quản lý category cho admin
router.post('/createcategory',authMiddleware, categoryController.createCategory);
router.get('/allcategory', cacheMiddleware(600),authMiddleware, categoryController.getAllCategories);
router.delete('/categories/:id', authMiddleware, categoryController.deleteCategory);

router.patch('/categories/edit/:categoryId', authMiddleware, categoryController.updateCategory);

router.put('/categories/restore/:id', authMiddleware, categoryController.restoreCategory);
router.get('/historycategorydelete',cacheMiddleware(60), authMiddleware, categoryController.getDeletedCategories);

module.exports = router;
