const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // List of hardcoded accounts (from .env)
    const hardcodedAccounts = [
      {
        email:    process.env.ADMIN_EMAIL    || 'admin@auramusic.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        id:       'admin-owner',
        name:     'Chủ sở hữu (Admin)',
        avatar:   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role:     'admin',
      },
      {
        email:    process.env.USER2_EMAIL    || 'Koanh@gmail.com',
        password: process.env.USER2_PASSWORD || 'abc123',
        id:       'user-koanh',
        name:     'Koanh',
        avatar:   'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        role:     'user',
      },
      {
        email:    process.env.USER3_EMAIL    || 'madu@gmail.com',
        password: process.env.USER3_PASSWORD || 'madu',
        id:       'user-madu',
        name:     'Madu',
        avatar:   'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
        role:     'user',
      },
    ];

    // Check against hardcoded accounts (case-insensitive email)
    const matched = hardcodedAccounts.find(
      acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    if (matched) {
      const token = jwt.sign(
        { id: matched.id, email: matched.email, role: matched.role },
        process.env.JWT_SECRET || 'aura_music_secret_jwt_key_2026',
        { expiresIn: '30d' }
      );
      return res.json({
        _id:    matched.id,
        name:   matched.name,
        email:  matched.email,
        avatar: matched.avatar,
        role:   matched.role,
        token
      });
    }

    // Try MongoDB user lookup if database is connected
    try {
      const user = await User.findOne({ email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'aura_music_secret_jwt_key_2026',
            { expiresIn: '30d' }
          );
          return res.json({
            _id:    user._id,
            name:   user.name,
            email:  user.email,
            avatar: user.avatar,
            token
          });
        }
      }
    } catch (dbErr) {}

    return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginUser };


