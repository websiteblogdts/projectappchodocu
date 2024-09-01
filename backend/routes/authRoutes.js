const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const User = require('../models/User'); // Đảm bảo import model User
const authMiddleware = require('../middlewares/authMiddleware');

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route for Google authentication
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }), 
  (req, res, next) => {
    // Check if the user needs to provide a phone number
    if (req.authInfo && req.authInfo.needPhoneNumber) {
      return res.redirect('/auth/add-phone-number'); // Redirect to the phone number input form
    }
    next(); // Continue to the controller if phone number is provided or not required
  }, 
  userController.googleLoginCallback
);

// dẫn đến trang điền sdt
router.get('/add-phone-number', (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/google'); // Redirect to Google login if user is not authenticated
  }
  res.render('add-phone-number'); // Render a form where the user can add their phone number
});

// // Route xử lý việc thêm số điện thoại
// router.post('/add-phone-number', async (req, res) => {
//   const { phone_number } = req.body;
  
//   if (!phone_number) {
//     return res.status(400).json({ error: 'Phone number is required' });
//   }
  
//   try {
//     // Cập nhật số điện thoại cho người dùng hiện tại
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     // Kiểm tra xem số điện thoại có bị trùng lặp không
//     const existingUser = await User.findOne({ phone_number, _id: { $ne: req.user._id } });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Phone number already in use' });
//     }

//     // Cập nhật số điện thoại cho người dùng hiện tại
//     user.phone_number = phone_number;
//     await user.save();

//     res.status(200).json({ message: 'Phone number updated successfully' });
//   } catch (error) {
//     console.error('Error adding phone number:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
router.post('/add-phone-number', async (req, res) => {
  const { phone_number } = req.body;

  // Check if phone number is provided
  if (!phone_number) {
    return res.render('add-phone-number', { error: 'Phone number is required' });
  }

  // Check if phone number is at least 10 digits
  const phoneNumberRegex = /^\d{10,}$/; // Regex to match at least 10 digits
  if (!phoneNumberRegex.test(phone_number)) {
    return res.render('add-phone-number', { error: 'Phone number must be at least 10 digits long' });
  }

  try {
    // Check if the phone number already exists for another user
    const existingUser = await User.findOne({ phone_number, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.render('add-phone-number', { error: 'Phone number already in use' });
    }

    // Update the phone number for the current user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.phone_number = phone_number;
    await user.save();

    res.redirect('/'); // Redirect to the homepage or another page after successful update
  } catch (error) {
    console.error('Error adding phone number:', error);
    res.status(500).render('add-phone-number', { error: 'Internal Server Error' });
  }
});


// Logout route
router.get('/logout', (req, res) => { 
  req.logout(() => { 
    res.redirect('/'); 
  }); 
});

// Route to validate token
router.get('/validate-token', authMiddleware, (req, res) => {
  res.json({ isValid: true, user: req.user });
});

module.exports = router;
