const Playlist = require('../models/Playlist');

const getPlaylists = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json([]);
    const playlists = await Playlist.find({ userId }).sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPlaylist = async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) return res.status(400).json({ message: 'Missing name or userId' });
    
    const newPlaylist = new Playlist({ name, userId, songs: [] });
    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { songId, songIds } = req.body;
    
    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    
    let modified = false;
    const addId = (sid) => {
      if (sid && !playlist.songs.includes(sid)) {
        playlist.songs.push(sid);
        modified = true;
      }
    };

    if (songIds && Array.isArray(songIds)) {
      songIds.forEach(addId);
    } else if (songId) {
      addId(songId);
    }
    
    if (modified) {
      await playlist.save();
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;
    
    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    
    playlist.songs = playlist.songs.filter(s => s !== songId);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    await Playlist.findByIdAndDelete(id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlaylists,
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist
};
