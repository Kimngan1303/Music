const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  songs: [{ type: String }], // Array of music custom IDs (e.g. s12345 format)
  pinned: { type: Boolean, default: false },
  cover: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', playlistSchema);
