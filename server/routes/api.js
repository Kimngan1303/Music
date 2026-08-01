const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const ytSearch = require('yt-search');

const User = require('../models/User');
const Music = require('../models/Music');
const Playlist = require('../models/Playlist');
const Favorite = require('../models/Favorite');
const RecentlyPlayed = require('../models/RecentlyPlayed');
const DailyStat = require('../models/DailyStat');
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
    res.json({ token, user: { id: user._id, _id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role || (user.email === 'tyn@gmail.com' ? 'admin' : 'user'), totalActiveTime: user.totalActiveTime || 0 } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/auth/profile', auth, async (req, res) => {
  try {
    const { name, avatar, favorites } = req.body;
    let user = await User.findById(req.user.id);
    if (!user && req.user.email) {
      user = await User.findOne({ email: new RegExp(`^${req.user.email}$`, 'i') });
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (favorites !== undefined) user.favorites = favorites;
    
    await user.save();
    res.json({ id: user._id, _id: user._id, name: user.name, email: user.email, avatar: user.avatar, favorites: user.favorites });
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
    const userRole = user.role || (user.email === 'tyn@gmail.com' ? 'admin' : 'user');
    res.json({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: userRole, isLocked: user.isLocked || false, favorites: user.favorites || [], lastSeen: user.lastSeen, totalActiveTime: user.totalActiveTime || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dedicated heartbeat endpoint - called every 5s by active clients only
router.post('/auth/heartbeat', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let updatedUser = await User.findByIdAndUpdate(req.user.id, { 
      lastSeen: new Date(),
      $inc: { totalActiveTime: 5 } // Increment by 5 seconds
    }, { new: true });

    if (!updatedUser && req.user.email) {
      updatedUser = await User.findOneAndUpdate(
        { email: new RegExp(`^${req.user.email}$`, 'i') },
        { lastSeen: new Date(), $inc: { totalActiveTime: 5 } },
        { new: true }
      );
    }

    if (updatedUser) {
      const uIdStr = String(updatedUser._id);
      await DailyStat.findOneAndUpdate(
        { date: today },
        { 
          $addToSet: { activeUsers: uIdStr },
          $inc: { [`userTimes.${uIdStr}`]: 5 }
        },
        { upsert: true }
      );
    }
    res.json({ ok: true, totalActiveTime: updatedUser ? updatedUser.totalActiveTime : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// --- ADMIN USER MANAGEMENT ROUTES ---
router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const now = new Date();
    const formatted = users.map(u => {
      const isSuperAdmin = u.email === 'tyn@gmail.com' || u.email === 'unnull@gmail.com';
      const lastSeenTime = u.lastSeen ? new Date(u.lastSeen).getTime() : 0;
      const diff = lastSeenTime > 0 ? Math.abs(now.getTime() - lastSeenTime) : Infinity;
      const isOnline = diff < 180000; // 3 minutes window to accommodate latency, cold starts, and tab throttling
      return {
        ...u._doc,
        role: isSuperAdmin ? 'admin' : (u.role || 'user'),
        lastSeen: u.lastSeen || null,
        isOnline
      };
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ADMIN STATISTICS ROUTE ---
router.get('/admin/stats', async (req, res) => {
  try {
    const now = new Date();

    const [
      totalUsers,
      totalSongs,
      totalPlaylists,
      allUsers,
      thirtyDaysStats,
      allMusic
    ] = await Promise.all([
      User.countDocuments(),
      Music.countDocuments(),
      Playlist.countDocuments(),
      User.find().select('name avatar email totalActiveTime role').sort({ totalActiveTime: -1 }),
      DailyStat.find().sort({ date: -1 }).limit(30),
      Music.find().select('addedBy createdAt')
    ]);

    // All active users strictly sorted by totalActiveTime descending
    const topActiveUsers = allUsers.map(u => ({
      _id: u._id,
      name: u.name,
      avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: u.email,
      totalActiveTime: u.totalActiveTime || 0,
      role: u.role
    })).sort((a, b) => b.totalActiveTime - a.totalActiveTime);

    // Map of users for fast lookup
    const userMap = new Map(allUsers.map(u => [String(u._id), u]));

    // Chart data for daily active users with populated active users list
    const dailyActiveUsersChart = thirtyDaysStats.reverse().map(stat => {
      const rawUserTimes = stat.userTimes;
      const userTimesMap = rawUserTimes instanceof Map 
        ? Object.fromEntries(rawUserTimes) 
        : (typeof rawUserTimes === 'object' && rawUserTimes !== null ? rawUserTimes : {});

      // Filter music added on this specific date
      const songsOnDate = allMusic.filter(m => {
        if (!m.createdAt) return false;
        try {
          const dStr = new Date(m.createdAt).toISOString().split('T')[0];
          return dStr === stat.date;
        } catch { return false; }
      });

      // Map of uploader key => song count
      const songsAddedMap = {};
      songsOnDate.forEach(m => {
        if (m.addedBy) {
          const k = String(m.addedBy).toLowerCase();
          songsAddedMap[k] = (songsAddedMap[k] || 0) + 1;
        }
      });

      const userList = (stat.activeUsers || []).map(uId => {
        const uIdStr = String(uId);
        const userObj = userMap.get(uIdStr);
        const daySeconds = userTimesMap[uIdStr] !== undefined 
          ? userTimesMap[uIdStr] 
          : (userObj ? userObj.totalActiveTime : 0);

        const keyId = uIdStr.toLowerCase();
        const keyEmail = userObj?.email?.toLowerCase() || '';
        const keyName = userObj?.name?.toLowerCase() || '';

        const addedSongsCount = (songsAddedMap[keyId] || 0) +
          (keyEmail && keyEmail !== keyId ? (songsAddedMap[keyEmail] || 0) : 0) +
          (keyName && keyName !== keyId && keyName !== keyEmail ? (songsAddedMap[keyName] || 0) : 0);

        return {
          _id: uIdStr,
          name: userObj ? userObj.name : 'Người dùng hệ thống',
          email: userObj ? userObj.email : '',
          avatar: userObj ? (userObj.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80") : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          activeSeconds: daySeconds,
          addedSongsCount
        };
      }).sort((a, b) => b.activeSeconds - a.activeSeconds);

      return {
        date: stat.date,
        count: stat.activeUsers.length,
        users: userList
      };
    });

    res.json({
      users: { total: totalUsers },
      songs: { total: totalSongs },
      playlists: { total: totalPlaylists },
      topActiveUsers,
      dailyActiveUsersChart,
      generatedAt: now
    });
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

// --- IN-MEMORY CACHE SYSTEM ---
const cache = {
  leaderboard: { data: null, timestamp: 0, ttl: 20000 },
  popularSongs: { data: null, timestamp: 0, ttl: 30000 },
  adminStats: { data: null, timestamp: 0, ttl: 15000 }
};

// --- PUBLIC LEADERBOARD ROUTE (With 20s In-Memory Cache) ---
router.get('/leaderboard', async (req, res) => {
  try {
    const now = Date.now();
    if (cache.leaderboard.data && (now - cache.leaderboard.timestamp < cache.leaderboard.ttl)) {
      return res.json(cache.leaderboard.data);
    }

    const topUsers = await User.find()
      .select('name avatar email totalActiveTime role')
      .sort({ totalActiveTime: -1 })
      .limit(10)
      .lean();

    const formatted = topUsers.map((u, index) => ({
      rank: index + 1,
      _id: u._id,
      name: u.name,
      avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: u.email,
      totalActiveTime: u.totalActiveTime || 0
    }));

    cache.leaderboard.data = formatted;
    cache.leaderboard.timestamp = now;
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- MUSIC ROUTES ---
router.get('/music', async (req, res) => {
  try {
    const songs = await Music.find().sort({ createdAt: -1 }).lean();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- GLOBAL POPULAR SONGS ROUTE (With 30s In-Memory Cache) ---
router.get('/music/popular', async (req, res) => {
  try {
    const now = Date.now();
    if (cache.popularSongs.data && (now - cache.popularSongs.timestamp < cache.popularSongs.ttl)) {
      return res.json(cache.popularSongs.data);
    }

    const popularSongs = await Music.find().sort({ playCount: -1, createdAt: -1 }).limit(15).lean();
    cache.popularSongs.data = popularSongs;
    cache.popularSongs.timestamp = now;
    res.json(popularSongs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increment play count for a song when played by any user
router.post('/music/:id/listen', async (req, res) => {
  try {
    const songId = req.params.id;
    const song = await Music.findOne({ $or: [{ _id: songId }, { id: songId }, { youtubeId: songId }] });
    if (song) {
      song.playCount = (song.playCount || 0) + 1;
      await song.save();
      return res.json({ success: true, playCount: song.playCount });
    }
    res.json({ success: false });
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

router.get('/music/search-online', async (req, res) => {
  try {
    const { q, query, limit = 15 } = req.query;
    const searchTerm = q || query;
    if (!searchTerm || !searchTerm.trim()) {
      return res.status(400).json({ message: 'Từ khóa tìm kiếm không được để trống.' });
    }

    const r = await ytSearch(searchTerm.trim());
    if (!r || !r.videos || r.videos.length === 0) {
      return res.json([]);
    }

    const maxLimit = Math.min(parseInt(limit) || 15, 30);
    const results = r.videos.slice(0, maxLimit).map((v) => ({
      id: 'yt_' + v.videoId,
      youtubeId: v.videoId,
      youtubeUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
      title: v.title,
      artist: v.author ? v.author.name : 'YouTube Creator',
      thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
      duration: v.timestamp || '3:30',
      views: v.views || 0,
      ago: v.ago || ''
    }));

    res.json(results);
  } catch (err) {
    console.error('Error in search-online:', err);
    res.status(500).json({ message: 'Lỗi khi tìm kiếm bài hát online: ' + err.message });
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
    const { name, pinned, cover, songs } = req.body;
    const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.user.id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    if (name !== undefined) playlist.name = name;
    if (pinned !== undefined) playlist.pinned = pinned;
    if (cover !== undefined) playlist.cover = cover;
    if (songs !== undefined) playlist.songs = songs;

    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/playlists/:id/add', auth, async (req, res) => {
  try {
    const { songId, songIds } = req.body;
    const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.user.id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    const idsToAdd = songIds || (songId ? [songId] : []);
    idsToAdd.forEach(id => {
      if (id && !playlist.songs.includes(id)) {
        playlist.songs.push(id);
      }
    });

    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/playlists/:id/remove', auth, async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.user.id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    if (songId) {
      playlist.songs = playlist.songs.filter(id => id !== songId && id !== String(songId));
    }

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

// --- SOCIAL, MESSAGING & LISTEN TOGETHER ROUTES ---
const Friendship = require('../models/Friendship');
const Message = require('../models/Message');

// Search members by name or email for active friend request
router.get('/social/search-users', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) return res.json([]);

    const regex = new RegExp(q.trim(), 'i');
    const users = await User.find({
      $or: [{ name: regex }, { email: regex }]
    }).select('-password').limit(15).lean();

    const now = new Date();
    const formatted = users.map(u => ({
      ...u,
      isOnline: u.lastSeen ? (Math.abs(now.getTime() - new Date(u.lastSeen).getTime()) < 180000) : false
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 1. Friend Requests & Friend List
router.get('/social/friends', auth, async (req, res) => {
  try {
    const currentUserId = String(req.user.id);
    const currentUserEmail = req.user.email;

    const friendships = await Friendship.find({
      $or: [
        { requesterId: currentUserId },
        { recipientId: currentUserId },
        { requesterId: currentUserEmail },
        { recipientId: currentUserEmail }
      ],
      status: 'accepted'
    });

    const friendIds = friendships.map(f =>
      (f.requesterId === currentUserId || f.requesterId === currentUserEmail) ? f.recipientId : f.requesterId
    );

    const friends = await User.find({
      $or: [{ _id: { $in: friendIds } }, { email: { $in: friendIds } }]
    }).select('-password').lean();

    const now = new Date();
    const formatted = await Promise.all(friends.map(async f => {
      const friendId = String(f._id);
      const friendEmail = f.email || '';

      const lastMsg = await Message.findOne({
        $or: [
          { senderId: currentUserId, recipientId: friendId },
          { senderId: friendId, recipientId: currentUserId },
          { senderId: currentUserId, recipientId: friendEmail },
          { senderId: friendEmail, recipientId: currentUserId }
        ]
      }).sort({ createdAt: -1 }).lean();

      return {
        ...f,
        isOnline: f.lastSeen ? (Math.abs(now.getTime() - new Date(f.lastSeen).getTime()) < 180000) : false,
        lastMessage: lastMsg ? {
          text: lastMsg.text,
          sharedSong: lastMsg.sharedSong,
          senderId: lastMsg.senderId,
          createdAt: lastMsg.createdAt,
          id: String(lastMsg._id)
        } : null
      };
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Pending Friend Requests for Notification Panel
router.get('/social/friend-requests/pending', auth, async (req, res) => {
  try {
    const currentUserId = String(req.user.id);
    const currentUserEmail = req.user.email || '';

    const pendingReqs = await Friendship.find({
      $or: [
        { recipientId: currentUserId },
        { recipientId: currentUserEmail }
      ],
      status: 'pending'
    }).lean();

    const requesterIds = pendingReqs.map(p => p.requesterId);
    const requesters = await User.find({
      $or: [{ _id: { $in: requesterIds } }, { email: { $in: requesterIds } }]
    }).select('-password').lean();

    const formatted = pendingReqs.map(pReq => {
      const reqUser = requesters.find(u => String(u._id) === String(pReq.requesterId) || u.email === pReq.requesterId);
      return {
        _id: pReq._id,
        requesterId: pReq.requesterId,
        user: reqUser || { name: 'Thành viên', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
        createdAt: pReq.createdAt
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/social/friend-request', auth, async (req, res) => {
  try {
    const { targetUserId, action } = req.body; // action: 'request' | 'accept' | 'reject'
    const currentUserId = String(req.user.id);

    if (!targetUserId || targetUserId === currentUserId) {
      return res.status(400).json({ message: 'Thao tác kết bạn không hợp lệ' });
    }

    if (action === 'accept') {
      await Friendship.updateMany(
        {
          $or: [
            { requesterId: targetUserId, recipientId: currentUserId },
            { requesterId: currentUserId, recipientId: targetUserId }
          ]
        },
        { status: 'accepted' }
      );
      return res.json({ message: 'Đã chấp nhận lời mời kết bạn! 🎉', status: 'accepted' });
    }

    if (action === 'reject') {
      await Friendship.deleteMany({
        $or: [
          { requesterId: targetUserId, recipientId: currentUserId },
          { requesterId: currentUserId, recipientId: targetUserId }
        ]
      });
      return res.json({ message: 'Đã từ chối lời mời kết bạn', status: 'rejected' });
    }

    // Default: 'request'
    let fs = await Friendship.findOne({
      $or: [
        { requesterId: currentUserId, recipientId: targetUserId },
        { requesterId: targetUserId, recipientId: currentUserId }
      ]
    });

    if (fs) {
      if (fs.status === 'accepted') return res.json({ message: 'Cả hai đã là bạn bè!', status: 'accepted' });
      return res.json({ message: 'Lời mời kết bạn đã được gửi từ trước!', status: 'pending' });
    }

    fs = new Friendship({ requesterId: currentUserId, recipientId: targetUserId, status: 'pending' });
    await fs.save();
    res.json({ message: 'Đã gửi lời mời kết bạn thành công! ✨', status: 'pending' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get recent direct messages where current user is recipient for notification alerts
router.get('/social/recent-direct-messages', auth, async (req, res) => {
  try {
    const currentUserId = String(req.user.id);
    const currentUserEmail = req.user.email || '';

    const recentMsgs = await Message.find({
      $or: [
        { recipientId: currentUserId },
        { recipientId: currentUserEmail }
      ]
    }).sort({ createdAt: -1 }).limit(30).lean();

    res.json(recentMsgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Direct Messages & Public Chat
router.get('/social/messages/:targetUserId', auth, async (req, res) => {
  try {
    const currentUserId = String(req.user.id);
    const targetUserId = String(req.params.targetUserId);

    let query = {};
    if (targetUserId === 'all' || targetUserId === 'public') {
      query = { recipientId: 'public' };
    } else {
      query = {
        $or: [
          { senderId: currentUserId, recipientId: targetUserId },
          { senderId: targetUserId, recipientId: currentUserId }
        ]
      };
    }

    const messages = await Message.find(query).sort({ createdAt: 1 }).limit(150).lean();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/social/messages', auth, async (req, res) => {
  try {
    const { recipientId, text, sharedSong, listenInvite, senderName: clientSenderName, senderAvatar: clientSenderAvatar } = req.body;
    const currentUserId = String(req.user.id);

    let currentUser = await User.findById(currentUserId);
    if (!currentUser && req.user.email) {
      currentUser = await User.findOne({ email: new RegExp(`^${req.user.email}$`, 'i') });
    }

    const finalName = (currentUser && currentUser.name) ? currentUser.name : (clientSenderName || req.user.name || 'Thành viên');
    const finalAvatar = (currentUser && currentUser.avatar) ? currentUser.avatar : (clientSenderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

    const newMsg = new Message({
      senderId: currentUserId,
      senderName: finalName,
      senderAvatar: finalAvatar,
      recipientId: recipientId || 'public',
      text: text || '',
      sharedSong: sharedSong || null,
      listenInvite: listenInvite || null
    });

    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 3. Listen Together (Phòng Nghe Nhạc Cùng Nhau) Room In-Memory Sync Engine
const listenRooms = new Map(); // roomId => { hostId, hostName, track, curTime, isPlaying, members: [] }
const listenRoomInvites = []; // [{ id, hostId, hostName, hostAvatar, targetUserId, roomId, createdAt }]

router.post('/social/listen-room/invite', auth, async (req, res) => {
  try {
    const { targetUserId, roomId } = req.body;
    const currentUserId = String(req.user.id);

    let currentUser = await User.findById(currentUserId);
    const hostName = currentUser ? currentUser.name : (req.user.name || 'Host');
    const hostAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    const inviteObj = {
      id: 'invite_' + Date.now(),
      hostId: currentUserId,
      hostName,
      hostAvatar,
      targetUserId: String(targetUserId),
      roomId: roomId || `room_${currentUserId}`,
      createdAt: new Date()
    };

    listenRoomInvites.push(inviteObj);
    res.json({ message: `Đã gửi lời mời nghe nhạc tới thành viên! 🎧`, invite: inviteObj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/social/listen-room/invites/pending', auth, async (req, res) => {
  try {
    const currentUserId = String(req.user.id);
    const currentUserEmail = req.user.email || '';

    const pending = listenRoomInvites.filter(inv =>
      inv.targetUserId === currentUserId || inv.targetUserId === currentUserEmail
    );

    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/social/listen-room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = listenRooms.get(roomId);
  if (!room) {
    return res.json({ active: false, roomId });
  }
  res.json({ active: true, room });
});

router.post('/social/listen-room/sync', auth, async (req, res) => {
  try {
    const { roomId, track, curTime, isPlaying, action } = req.body;
    const currentUserId = String(req.user.id);

    let targetRoomId = roomId;
    if (!targetRoomId) {
      if (action === 'create') {
        targetRoomId = `room_${currentUserId}`;
      } else {
        return res.json({ success: false, room: null });
      }
    }

    let room = listenRooms.get(targetRoomId);

    if (action === 'leave') {
      if (room) {
        room.members = room.members.filter(m => m.id !== currentUserId);
        if (room.members.length === 0) {
          listenRooms.delete(targetRoomId);
        }
      }
      return res.json({ success: true, message: 'Đã rời phòng nghe nhạc chung', room: null });
    }

    if (action === 'create') {
      let currentUser = await User.findById(currentUserId);
      room = {
        roomId: targetRoomId,
        hostId: currentUserId,
        hostName: currentUser ? currentUser.name : (req.user.name || 'Host'),
        track: track || null,
        curTime: curTime || 0,
        isPlaying: Boolean(isPlaying),
        members: [{ id: currentUserId, name: currentUser ? currentUser.name : 'Host' }],
        updatedAt: Date.now()
      };
      listenRooms.set(room.roomId, room);
    } else if (room) {
      if (action === 'join') {
        let currentUser = await User.findById(currentUserId);
        if (!room.members.some(m => m.id === currentUserId)) {
          room.members.push({ id: currentUserId, name: currentUser ? currentUser.name : 'Thành viên' });
        }
      } else if (action === 'sync') {
        // ONLY host can update track, playback state and timeline!
        if (room.hostId === currentUserId) {
          if (track) room.track = track;
          if (curTime !== undefined) room.curTime = curTime;
          if (isPlaying !== undefined) room.isPlaying = Boolean(isPlaying);
          room.updatedAt = Date.now();
        }
      }
    }

    res.json({ success: true, room: room || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

