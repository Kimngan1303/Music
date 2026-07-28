const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // List of hardcoded accounts (from .env)
    const hardcodedAccounts = [
      {
        email:    process.env.ADMIN_EMAIL    || 'admin@gmail.com',
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
        email:    process.env.USER3_EMAIL    || 'unnull@gmail.com',
        username: 'unnull',
        password: process.env.USER3_PASSWORD || 'unnull',
        id:       'user-unnull',
        name:     'Unnull',
        avatar:   'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
        role:     'user',
      },
      {
        email:    process.env.USER4_EMAIL    || 'Sweefee@gmail.com',
        username: 'Sweefee',
        password: process.env.USER4_PASSWORD || '12345678',
        id:       'user-sweefee',
        name:     'Sweefee',
        avatar:   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role:     'user',
      },
    ];

    // Check against hardcoded accounts (case-insensitive email/username)
    const matched = hardcodedAccounts.find(
      acc => (
        acc.email.toLowerCase() === email.toLowerCase() ||
        (acc.username && acc.username.toLowerCase() === email.toLowerCase()) ||
        acc.email.split('@')[0].toLowerCase() === email.toLowerCase()
      ) && acc.password === password
    );

    if (matched) {
      // Lưu thông tin người dùng vào database để đồng bộ
      let dbUser;
      try {
        const hashedPassword = await bcrypt.hash(matched.password, 10);
        dbUser = await User.findOneAndUpdate(
          { _id: matched.id },
          { 
            $set: {
              email: matched.email,
              password: hashedPassword
            },
            $setOnInsert: {
              name: matched.name,
              avatar: matched.avatar,
              role: matched.role || 'user',
              isLocked: false
            }
          },
          { upsert: true, new: true }
        );

        if (dbUser.isLocked) {
          return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa bởi Quản trị viên.' });
        }
      } catch (err) {
        console.error('Lỗi lưu user vào db:', err);
        dbUser = matched;
      }

      const userRole = dbUser.role || matched.role || 'user';
      const token = jwt.sign(
        { id: matched.id, email: matched.email, role: userRole },
        process.env.JWT_SECRET || 'aura_music_secret_jwt_key_2026',
        { expiresIn: '30d' }
      );
      return res.json({
        _id:    dbUser._id || matched.id,
        name:   dbUser.name || matched.name,
        email:  dbUser.email || matched.email,
        avatar: dbUser.avatar || matched.avatar,
        favorites: dbUser.favorites || [],
        role:   userRole,
        isLocked: dbUser.isLocked || false,
        token
      });
    }

    // Try MongoDB user lookup if database is connected
    try {
      const cleanEmail = email.trim().toLowerCase();
      const user = await User.findOne({
        $or: [
          { email: cleanEmail },
          { email: `${cleanEmail}@gmail.com` },
          { _id: `user-${cleanEmail}` }
        ]
      });
      if (user) {
        if (user.isLocked) {
          return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa bởi Quản trị viên.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const userRole = user.role || (user.email === 'admin@gmail.com' ? 'admin' : 'user');
          const token = jwt.sign(
            { id: user._id, email: user.email, role: userRole },
            process.env.JWT_SECRET || 'aura_music_secret_jwt_key_2026',
            { expiresIn: '30d' }
          );
          return res.json({
            _id:    user._id,
            name:   user.name,
            email:  user.email,
            avatar: user.avatar,
            favorites: user.favorites || [],
            role:   userRole,
            isLocked: user.isLocked || false,
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


