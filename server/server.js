const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mounted API Endpoints
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/music', require('./routes/musicRoutes'));
app.use('/api/playlists', require('./routes/playlistRoutes'));
app.use('/api', require('./routes/api'));

// Serve client dist static files if built (local dev only)
app.use(express.static('../client/dist'));

const PORT = process.env.PORT || 5000;

// Only listen when run directly (not when imported by Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Aura Music Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;

