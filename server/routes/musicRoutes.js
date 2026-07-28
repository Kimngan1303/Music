const express = require('express');
const router = express.Router();
const { getSongs, parseYouTubeUrl, addSong, deleteSong, deleteBatchSongs, searchYouTube, addPlaylist, addSpotifyPlaylist } = require('../controllers/musicController');

router.get('/', getSongs);
router.get('/search', searchYouTube);
router.post('/parse-youtube', parseYouTubeUrl);
router.post('/', addSong);
router.post('/playlist', addPlaylist);
router.post('/spotify-playlist', addSpotifyPlaylist);
router.post('/batch-delete', deleteBatchSongs);
router.delete('/:id', deleteSong);

module.exports = router;

