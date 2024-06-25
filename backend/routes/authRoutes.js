const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Route để validate token
router.get('/validate-token', authMiddleware, (req, res) => {
  res.json({ isValid: true, user: req.user });
});

module.exports = router;
