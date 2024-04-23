const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

//http://localhost:3000/admin/products/?approved=false sử dụng mẫu api này để xem product chưa được duyệt
router.get('/products', adminController.getProductsByApprovalStatus);

//quản lý category cho admin
router.post('/createcategory', categoryController.createCategory);
router.get('/allcategory', categoryController.getAllCategories);
router.delete('/categories/:id', categoryController.deleteCategory);

//quản lý product cho admin
router.put('/product/:productId/approved', adminController.updateApprovedStatus); // phê duyệt sản phẩm
// router.get('/productchuaduyet', adminController.getProductFalse);
// router.get('/productdaduyet', adminController.getProductTrue);

//quản lý user cho admin
//lấy tất cả user cho trang list hiển thị ở admin
router.get('/getalluser', adminController.getAllUsers); // token user vẫn dùng được, cần fix.
//lay thong tin user theo id cho trang detail user của admin
router.get('/userbyid/:userId', adminController.getUserById);

router.use(authMiddleware);
router.delete('/delete/:userId', authMiddleware,adminController.deleteUserById);
router.put('/changstatusaccount/:userId', authMiddleware,adminController.changeStatusAccount); // lock or unlock account 
router.put('/usersforadmin/:userId', authMiddleware,adminController.updateUserByIdForAdmin);//update user by admin 
// router.post('/users/:userId/unlock',authMiddleware, adminController.unlockUserAccount);
// router.post('/users/:userId/lock', authMiddleware,adminController.lockUserAccount);
module.exports = router;
