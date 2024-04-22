const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const authMiddleware = require('../middlewares/authMiddleware');


router.get('/productchuaduyet', adminController.getProductFalse);
router.get('/productdaduyet', adminController.getProductTrue);

router.put('/product/:productId/approved', adminController.updateApprovedStatus);

router.get('/getalluser', adminController.getAllUsers); // token user vẫn dùng được, cần fix.

router.get('/userbyid/:userId', adminController.getUserById);

router.delete('/users/:userId', adminController.deleteUserById);

router.use(authMiddleware);

router.put('/changstatusaccount/:userId', authMiddleware,adminController.changeStatusAccount);//update user by admin 
router.put('/usersforadmin/:userId', authMiddleware,adminController.updateUserByIdForAdmin);//update user by admin 
// router.post('/users/:userId/unlock',authMiddleware, adminController.unlockUserAccount);
// router.post('/users/:userId/lock', authMiddleware,adminController.lockUserAccount);
module.exports = router;
