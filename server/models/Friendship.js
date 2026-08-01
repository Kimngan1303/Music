const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  requesterId: { type: String, required: true },
  recipientId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

friendshipSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

module.exports = mongoose.model('Friendship', friendshipSchema);
