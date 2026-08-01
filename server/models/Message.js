const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String },
  recipientId: { type: String, required: true }, // 'all' for public room, or userId for 1-1
  text: { type: String, default: '' },
  sharedSong: {
    title: { type: String },
    artist: { type: String },
    thumbnail: { type: String },
    youtubeId: { type: String },
    id: { type: String }
  },
  listenInvite: {
    roomId: { type: String },
    hostId: { type: String },
    hostName: { type: String },
    hostAvatar: { type: String }
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

messageSchema.index({ senderId: 1, recipientId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
