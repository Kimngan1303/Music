const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isLocked: { type: Boolean, default: false },
  lastSeen: { type: Date, default: null },
  totalActiveTime: { type: Number, default: 0 },
  favorites: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
