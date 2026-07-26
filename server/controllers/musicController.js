const Music = require('../models/Music');
const axios = require('axios');
const ytSearch = require('yt-search');
const { Innertube } = require('youtubei.js');

const getSongs = async (req, res) => {
  try {
    const { userId } = req.query;
    // If userId is provided, fetch only their songs. Otherwise return empty array (we don't want cross-user leak)
    if (!userId) return res.json([]);
    
    const songs = await Music.find({ addedBy: userId }).sort({ createdAt: -1 });
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
    const { id, youtubeId, youtubeUrl, title, artist, thumbnail, duration, addedBy } = req.body;
    
    // Upsert the song so we don't get duplicates if they re-add or sync
    const song = await Music.findOneAndUpdate(
      { id }, // match by frontend ID
      {
        id,
        youtubeId,
        youtubeUrl,
        title,
        artist,
        thumbnail,
        duration,
        addedBy
      },
      { new: true, upsert: true }
    );
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    await Music.findOneAndDelete({ id });
    res.json({ message: 'Song removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPlaylist = async (req, res) => {
  try {
    const { playlistUrl, addedBy } = req.body;
    const match = playlistUrl.match(/[?&]list=([^#\&\?]+)/);
    const listId = match ? match[1] : null;
    
    if (!listId) {
      return res.status(400).json({ message: 'Đường dẫn Playlist YouTube không hợp lệ!' });
    }

    const yt = await Innertube.create();
    const playlist = await yt.getPlaylist(listId);
    
    if (!playlist || !playlist.items || playlist.items.length === 0) {
      return res.status(404).json({ message: 'Playlist trống hoặc không có quyền truy cập.' });
    }

    const songsToUpsert = playlist.items.map(item => {
      // Get title (sometimes it's nested in text objects)
      let title = 'Unknown Title';
      if (item.title) title = typeof item.title === 'string' ? item.title : item.title.text || title;
      
      // Get artist
      let artist = 'Unknown Artist';
      if (item.author) artist = typeof item.author === 'string' ? item.author : item.author.name || artist;
      
      // Format duration (e.g. { seconds: 210 } -> '3:30' or item.duration.text)
      let duration = '0:00';
      if (item.duration && item.duration.text) duration = item.duration.text;
      
      const vid = item.id;
      const sId = 's' + vid + Date.now(); // Ensure unique-ish local ID

      return {
        id: sId,
        youtubeId: vid,
        youtubeUrl: `https://www.youtube.com/watch?v=${vid}`,
        title: title,
        artist: artist,
        thumbnail: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
        duration: duration,
        addedBy: addedBy || null
      };
    });

    // We use a simple insert or loop through to upsert
    // Because it's a playlist, we can just insert them. If duplicates happen in DB, it's fine since 'id' is unique for this import batch.
    const createdSongs = await Music.insertMany(songsToUpsert);

    res.status(201).json(createdSongs);
  } catch (error) {
    console.error("Playlist Error:", error);
    res.status(500).json({ message: 'Lỗi khi tải Playlist: ' + error.message });
  }
};

const searchYouTube = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query is required' });
    const r = await ytSearch(query);
    const video = r.videos[0];
    if (!video) return res.status(404).json({ message: 'No video found' });
    res.json({
      youtubeId: video.videoId,
      title: video.title,
      artist: video.author.name,
      thumbnail: video.thumbnail,
      duration: video.timestamp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSongs, parseYouTubeUrl, addSong, deleteSong, searchYouTube, addPlaylist };
