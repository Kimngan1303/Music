const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://kngan13032004_db_user:Kimngan%400@ac-1l1ffjp-shard-00-00.lped0ju.mongodb.net:27017,ac-1l1ffjp-shard-00-01.lped0ju.mongodb.net:27017,ac-1l1ffjp-shard-00-02.lped0ju.mongodb.net:27017/auramusic?ssl=true&replicaSet=atlas-9nvkhg-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
