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

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
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

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/auth/profile', auth, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar });
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

router.post('/playlists/:id/add-song', auth, async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.user.id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
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
