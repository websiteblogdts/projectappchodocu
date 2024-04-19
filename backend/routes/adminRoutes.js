const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getRoutes);

router.get('/getall', adminController.getAllUsers);

router.get('/userbyid/:userId', adminController.getUserById);

router.put('/users/:userId', adminController.updateUserById);

router.put('/usersforadmin/:userId', adminController.updateUserByIdForAdmin);

router.delete('/users/:userId', adminController.deleteUserById);

module.exports = router;
