const mongoose = require('mongoose');

const dailyStatSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  activeUsers: [{ type: String }] // Array of user IDs
});

module.exports = mongoose.model('DailyStat', dailyStatSchema);
