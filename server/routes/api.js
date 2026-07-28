const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('../models/User');
const Music = require('../models/Music');
const Playlist = require('../models/Playlist');
const Favorite = require('../models/Favorite');
const RecentlyPlayed = require('../models/RecentlyPlayed');
const auth = require('../middleware/auth');

// --- AUTH ROUTES ---
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'aura_music_secret_jwt_key_2026', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'aura_music_secret_jwt_key_2026', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/auth/profile', auth, async (req, res) => {
  try {
    const { name, avatar, favorites } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (favorites !== undefined) user.favorites = favorites;
    
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/auth/change-password', auth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({ message: 'Mật khẩu mới phải từ 4 ký tự trở lên!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword.trim(), salt);

    let user = await User.findById(req.user.id);
    if (!user && req.user.email) {
      user = await User.findOne({ email: new RegExp(`^${req.user.email}$`, 'i') });
    }

    if (user) {
      user.password = hashedPassword;
      await user.save();
    } else {
      await User.create({
        _id: req.user.id || `user-${req.user.email?.split('@')[0]}`,
        email: req.user.email,
        password: hashedPassword,
        name: req.user.name || 'User',
        role: req.user.role || 'user'
      });
    }

    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    console.error('Lỗi đổi mật khẩu:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Update lastSeen timestamp on each heartbeat
    user.lastSeen = new Date();
    await user.save();
    const userRole = user.role || (user.email === 'tyn@gmail.com' ? 'admin' : 'user');
    res.json({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: userRole, isLocked: user.isLocked || false, favorites: user.favorites || [], lastSeen: user.lastSeen });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ADMIN USER MANAGEMENT ROUTES ---
router.get('/admin/users', async (req, res) => {
  try {
    await User.updateMany(
      { $or: [{ email: 'tyn@gmail.com' }, { email: 'unnull@gmail.com' }, { _id: 'admin-owner' }] },
      { $set: { role: 'admin' } }
    );
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const formatted = users.map(u => {
      const isSuperAdmin = u.email === 'tyn@gmail.com' || u.email === 'unnull@gmail.com';
      return {
        ...u._doc,
        role: isSuperAdmin ? 'admin' : (u.role || 'user'),
        lastSeen: u.lastSeen || null
      };
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/admin/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(400).json({ message: 'Email đã tồn tại trên hệ thống.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      _id: 'user-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'user',
      isLocked: false
    });

    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isLocked: newUser.isLocked,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/admin/users/:id', async (req, res) => {
  try {
    const { name, email, password, role, isLocked, avatar } = req.body;
    let user = await User.findById(req.params.id);
    if (!user && email) {
      user = await User.findOne({ email: email.trim().toLowerCase() });
    }

    const isTargetSuperAdmin = (user && (user.email === 'admin@gmail.com' || user.email === 'unnull@gmail.com' || req.params.id === 'admin-owner' || req.params.id === 'user-unnull')) || (email === 'admin@gmail.com' || email === 'unnull@gmail.com');

    // Reject locking or demoting super admin accounts
    if (isTargetSuperAdmin) {
      if (isLocked) return res.status(403).json({ message: 'Không thể khóa tài khoản Super Admin tối cao.' });
      if (role && role !== 'admin') return res.status(403).json({ message: 'Không thể hạ quyền tài khoản Super Admin tối cao.' });
    }

    if (!user) {
      user = new User({
        _id: req.params.id || 'user-' + Date.now(),
        name: name || 'User',
        email: email || 'user@gmail.com',
        password: 'default_password',
        role: role || 'user',
        isLocked: isLocked || false
      });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (role !== undefined) {
      user.role = isTargetSuperAdmin ? 'admin' : role;
    }
    if (isLocked !== undefined && !isTargetSuperAdmin) {
      user.isLocked = isLocked;
    }
    if (avatar !== undefined) user.avatar = avatar;

    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isLocked: user.isLocked,
      avatar: user.avatar,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/admin/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user && (user.email === 'admin@gmail.com' || user.email === 'unnull@gmail.com' || req.params.id === 'admin-owner' || req.params.id === 'user-unnull')) {
      return res.status(403).json({ message: 'Không thể xóa tài khoản Super Admin tối cao.' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa tài khoản thành công.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- MUSIC ROUTES ---
router.get('/music', async (req, res) => {
  try {
    const songs = await Music.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/music/parse-youtube', async (req, res) => {
  try {
    const { url } = req.body;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const youtubeId = (match && match[2].length === 11) ? match[2] : null;

    if (!youtubeId) return res.status(400).json({ message: 'Invalid YouTube URL' });

    const oembedRes = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`);
    const data = oembedRes.data;

    res.json({
      youtubeId,
      youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      title: data.title || 'YouTube Song',
      artist: data.author_name || 'YouTube Creator',
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      duration: '3:30'
    });
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch YouTube song metadata' });
  }
});

router.post('/music', auth, async (req, res) => {
  try {
    const { youtubeId, youtubeUrl, title, artist, thumbnail, duration } = req.body;
    const newSong = new Music({
      youtubeId,
      youtubeUrl,
      title,
      artist,
      thumbnail,
      duration,
      addedBy: req.user.id
    });
    await newSong.save();
    res.json(newSong);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- PLAYLIST ROUTES ---
router.get('/playlists', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.user.id }).populate('songs');
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/playlists', auth, async (req, res) => {
  try {
    const { name, description, coverImage } = req.body;
    const playlist = new Playlist({ name, description, coverImage, userId: req.user.id, songs: [] });
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/playlists/:id', auth, async (req, res) => {
  try {
    const { name, pinned, cover } = req.body;
    const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.user.id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    if (name !== undefined) playlist.name = name;
    if (pinned !== undefined) playlist.pinned = pinned;
    if (cover !== undefined) playlist.cover = cover;

    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- FAVORITES ROUTES ---
router.get('/favorites', auth, async (req, res) => {
  try {
    const favs = await Favorite.find({ userId: req.user.id }).populate('musicId');
    res.json(favs.map(f => f.musicId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/favorites/toggle', auth, async (req, res) => {
  try {
    const { musicId } = req.body;
    const existing = await Favorite.findOne({ userId: req.user.id, musicId });
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      res.json({ favorited: false });
    } else {
      const fav = new Favorite({ userId: req.user.id, musicId });
      await fav.save();
      res.json({ favorited: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- HISTORY ROUTES ---
router.post('/history', auth, async (req, res) => {
  try {
    const { musicId } = req.body;
    const entry = new RecentlyPlayed({ userId: req.user.id, musicId });
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
