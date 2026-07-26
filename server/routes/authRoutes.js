const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// Registration is disabled for personal site
router.post('/register', (req, res) => {
  res.status(403).json({ message: 'Tính năng đăng ký bị khóa trên trang web cá nhân này.' });
});

router.post('/login', loginUser);

module.exports = router;

