const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

//quản lý product cho admin
router.put('/product/:productId/approved', adminController.updateApprovedStatus); // phê duyệt sản phẩm

router.use(authMiddleware);
// Quản lý user cho admin
router.get('/getalluser', authMiddleware, adminController.getAllUsers); // Giờ đã được bảo vệ bởi authMiddleware
router.get('/userbyid/:userId', authMiddleware, adminController.getUserById);
router.delete('/user/delete/:userId', authMiddleware, adminController.deleteUserById);
router.put('/changstatusaccount/:userId', authMiddleware, adminController.changeStatusAccount); // Lock or unlock account
router.put('/usersforadmin/:userId', authMiddleware, adminController.updateUserByIdForAdmin);

//http://localhost:3000/admin/products/?approved=false sử dụng mẫu api này để xem product chưa được duyệt
router.get('/products', authMiddleware, adminController.getProductsByApprovalStatus);
//quản lý category cho admin
router.post('/createcategory',authMiddleware, categoryController.createCategory);
router.get('/allcategory', authMiddleware, categoryController.getAllCategories);
router.delete('/categories/:id', authMiddleware, categoryController.deleteCategory);
// router.post('/users/:userId/unlock',authMiddleware, adminController.unlockUserAccount);
// router.post('/users/:userId/lock', authMiddleware,adminController.lockUserAccount);
module.exports = router;
