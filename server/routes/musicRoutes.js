const express = require('express');
const router = express.Router();
const { getSongs, parseYouTubeUrl, addSong, deleteSong, searchYouTube, addPlaylist } = require('../controllers/musicController');

router.get('/', getSongs);
router.get('/search', searchYouTube);
router.post('/parse-youtube', parseYouTubeUrl);
router.post('/', addSong);
router.post('/playlist', addPlaylist);
router.delete('/:id', deleteSong);

module.exports = router;

