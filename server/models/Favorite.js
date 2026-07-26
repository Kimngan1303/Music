const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  musicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Music', required: true },
  createdAt: { type: Date, default: Date.now }
});

favoriteSchema.index({ userId: 1, musicId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
