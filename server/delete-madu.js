require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Xóa user
    const User = require('./models/User');
    const uResult = await User.deleteOne({ _id: 'user-madu' });
    console.log('Deleted user:', uResult);

    // Xóa playlist
    const Playlist = require('./models/Playlist');
    const pResult = await Playlist.deleteMany({ userId: 'user-madu' });
    console.log('Deleted playlists:', pResult);

    // Xóa favorite
    const Favorite = require('./models/Favorite');
    const fResult = await Favorite.deleteMany({ userId: 'user-madu' });
    console.log('Deleted favorites:', fResult);

    // Xóa recently played
    const RecentlyPlayed = require('./models/RecentlyPlayed');
    const rResult = await RecentlyPlayed.deleteMany({ userId: 'user-madu' });
    console.log('Deleted recently played:', rResult);
    
    // Xóa music (nếu có collection riêng của user, không thì thôi)
    const Music = require('./models/Music');
    if (Music) {
      const mResult = await Music.deleteMany({ userId: 'user-madu' });
      console.log('Deleted music:', mResult);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

run();
