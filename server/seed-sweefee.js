require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('12345678', 10);
    const user = await User.findOneAndUpdate(
      { _id: 'user-sweefee' },
      {
        $set: {
          email: 'Sweefee@gmail.com',
          password: hashedPassword,
          name: 'Sweefee',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        }
      },
      { upsert: true, new: true }
    );
    console.log('User Sweefee created/updated successfully in MongoDB:', user);
  } catch (error) {
    console.error('Error seeding user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedUser();
