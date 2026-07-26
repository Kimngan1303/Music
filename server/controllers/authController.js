const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@auramusic.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if input matches configured owner credentials
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(
        { id: 'admin-owner', email: adminEmail, role: 'admin' },
        process.env.JWT_SECRET || 'aura_music_secret_jwt_key_2026',
        { expiresIn: '30d' }
      );

      return res.json({
        _id: 'admin-owner',
        name: 'Chủ sở hữu (Admin)',
        email: adminEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
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
            _id: user._id,
            name: user.name,
            email: user.email,
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

