const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://kngan13032004_db_user:Kimngan%400@cluster0.lped0ju.mongodb.net/auramusic?appName=Cluster0';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
