const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://kngan13032004_db_user:Kimngan%400@cluster0.lped0ju.mongodb.net/auramusic?appName=Cluster0');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Running in local fallback mode until MongoDB server is started...');
  }
};

module.exports = connectDB;
