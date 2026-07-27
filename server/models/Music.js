const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  youtubeId: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  thumbnail: { type: String, required: true },
  duration: { type: String, default: '3:30' },
  addedBy: { type: String },
  inLibrary: { type: Boolean, default: true },
  id: { type: String }, // Custom ID to match frontend's s12345 format
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Music', musicSchema);
