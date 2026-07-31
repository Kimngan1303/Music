const express = require('express');
const router = express.Router();
const { getSongs, parseYouTubeUrl, addSong, deleteSong, deleteBatchSongs, searchYouTube, searchOnline, addPlaylist, addSpotifyPlaylist, getLyrics, polishLyricsController, getVideoLyrics } = require('../controllers/musicController');

router.get('/', getSongs);
router.get('/lyrics', getLyrics);
router.get('/video-lyrics', getVideoLyrics);
router.post('/lyrics/polish', polishLyricsController);
router.get('/search', searchYouTube);
router.get('/search-online', searchOnline);
router.post('/parse-youtube', parseYouTubeUrl);
router.post('/', addSong);
router.post('/playlist', addPlaylist);
router.post('/spotify-playlist', addSpotifyPlaylist);
router.post('/batch-delete', deleteBatchSongs);
router.delete('/:id', deleteSong);

module.exports = router;

