const mongoose = require('mongoose');

const dailyStatSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  activeUsers: [{ type: String }], // Array of user IDs
  userTimes: { type: Map, of: Number, default: {} } // Map of userId => active time in seconds on this specific day
});

dailyStatSchema.index({ date: -1 });

module.exports = mongoose.model('DailyStat', dailyStatSchema);
