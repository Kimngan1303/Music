const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu.' });
    }

    const cleanInput = email.trim().toLowerCase();
    const fullEmail = cleanInput.includes('@') ? cleanInput : `${cleanInput}@gmail.com`;

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
        role:     'admin',
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

    // Find matched hardcoded template config (if any)
    const matchedConfig = hardcodedAccounts.find(
      acc => (
        acc.email.toLowerCase() === cleanInput ||
        acc.email.toLowerCase() === fullEmail ||
        (acc.username && acc.username.toLowerCase() === cleanInput) ||
        acc.email.split('@')[0].toLowerCase() === cleanInput ||
        acc.id.toLowerCase() === cleanInput
      )
    );

    // 1. Try finding existing user in MongoDB database by actual email or username
    let dbUser = null;
    try {
      dbUser = await User.findOne({
        $or: [
          { email: new RegExp(`^${cleanInput}$`, 'i') },
          { email: new RegExp(`^${fullEmail}$`, 'i') },
          { username: new RegExp(`^${cleanInput}$`, 'i') }
        ]
      });
    } catch (e) {
      console.error('MongoDB findOne error:', e);
    }

    if (dbUser) {
      if (dbUser.isLocked) {
        return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa bởi Quản trị viên.' });
      }

      // Check entered password against hashed password in DB
      let isMatch = false;
      if (dbUser.password) {
        isMatch = await bcrypt.compare(password, dbUser.password);
      }

      // Fallback: Check if default hardcoded password matches (only if user hasn't set a custom DB password yet)
      if (!isMatch && matchedConfig && matchedConfig.password === password) {
        isMatch = true;
      }

      if (isMatch) {
        const userRole = dbUser.role || matchedConfig?.role || 'user';
        const token = jwt.sign(
          { id: dbUser._id, email: dbUser.email, role: userRole },
          process.env.JWT_SECRET || 'aura_music_secret_jwt_key_2026',
          { expiresIn: '30d' }
        );
        return res.json({
          _id: dbUser._id,
          name: dbUser.name,
          email: dbUser.email,
          avatar: dbUser.avatar,
          favorites: dbUser.favorites || [],
          role: userRole,
          isLocked: dbUser.isLocked || false,
          token
        });
      }

      return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    // 2. If user does NOT exist in DB yet, check initial default hardcoded accounts
    if (matchedConfig && matchedConfig.password === password) {
      // Seed account into MongoDB for future persistence
      let seededUser;
      try {
        const hashedPassword = await bcrypt.hash(matchedConfig.password, 10);
        seededUser = await User.create({
          _id: matchedConfig.id,
          name: matchedConfig.name,
          email: matchedConfig.email,
          password: hashedPassword,
          avatar: matchedConfig.avatar,
          role: matchedConfig.role || 'user',
          isLocked: false
        });
      } catch (err) {
        console.error('Lỗi khởi tạo tài khoản vào DB:', err);
        seededUser = matchedConfig;
      }

      const userRole = seededUser.role || matchedConfig.role || 'user';
      const token = jwt.sign(
        { id: matchedConfig.id, email: matchedConfig.email, role: userRole },
        process.env.JWT_SECRET || 'aura_music_secret_jwt_key_2026',
        { expiresIn: '30d' }
      );
      return res.json({
        _id: seededUser._id || matchedConfig.id,
        name: seededUser.name || matchedConfig.name,
        email: seededUser.email || matchedConfig.email,
        avatar: seededUser.avatar || matchedConfig.avatar,
        favorites: seededUser.favorites || [],
        role: userRole,
        isLocked: false,
        token
      });
    }

    return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginUser };


