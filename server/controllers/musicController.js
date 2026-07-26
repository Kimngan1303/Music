const Music = require('../models/Music');
const axios = require('axios');

const getSongs = async (req, res) => {
  try {
    const songs = await Music.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const parseYouTubeUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const youtubeId = (match && match[2].length === 11) ? match[2] : null;

    if (!youtubeId) return res.status(400).json({ message: 'Invalid YouTube URL' });

    const oembedRes = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`);
    const data = oembedRes.data;

    res.json({
      youtubeId,
      youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      title: data.title || 'YouTube Song',
      artist: data.author_name || 'YouTube Creator',
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      duration: '3:30'
    });
  } catch (error) {
    res.status(400).json({ message: 'Could not fetch song metadata from YouTube URL' });
  }
};

const addSong = async (req, res) => {
  try {
    const { youtubeId, youtubeUrl, title, artist, thumbnail, duration } = req.body;
    const song = await Music.create({
      youtubeId,
      youtubeUrl,
      title,
      artist,
      thumbnail,
      duration,
      addedBy: req.user ? req.user.id : null
    });
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    await Music.findByIdAndDelete(id);
    res.json({ message: 'Song removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSongs, parseYouTubeUrl, addSong, deleteSong };

