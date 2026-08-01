const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  let token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');

  if (!token) {
    req.user = { id: 'guest_user', name: 'Khách', email: 'guest@music.app', role: 'user' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aura_music_secret_jwt_key_2026');
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { id: 'guest_user', name: 'Khách', email: 'guest@music.app', role: 'user' };
    next();
  }
};

