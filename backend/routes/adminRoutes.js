const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const authMiddleware = require('../middlewares/authMiddleware');

// router.get('/productchuaduyet', adminController.getProductFalse);
// router.get('/productdaduyet', adminController.getProductTrue);

//http://localhost:3000/admin/products?approved=false sử dụng mẫu api này để xem product chưa được duyệt
router.put('/product/:productId/approved', adminController.updateApprovedStatus);

//lấy tất cả user cho trang list hiển thị ở admin
router.get('/getalluser', adminController.getAllUsers); // token user vẫn dùng được, cần fix.

//lay thong tin user theo id cho trang detail user của admin
router.get('/userbyid/:userId', adminController.getUserById);

router.use(authMiddleware);
router.delete('/delete/:userId', authMiddleware,adminController.deleteUserById);
router.get('/products',authMiddleware, adminController.getProductsByApprovalStatus);
router.put('/changstatusaccount/:userId', authMiddleware,adminController.changeStatusAccount); // lock or unlock account 
router.put('/usersforadmin/:userId', authMiddleware,adminController.updateUserByIdForAdmin);//update user by admin 
// router.post('/users/:userId/unlock',authMiddleware, adminController.unlockUserAccount);
// router.post('/users/:userId/lock', authMiddleware,adminController.lockUserAccount);
module.exports = router;
