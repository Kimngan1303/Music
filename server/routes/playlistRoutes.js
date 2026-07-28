const express = require('express');
const router = express.Router();
const {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist
} = require('../controllers/playlistController');

router.get('/', getPlaylists);
router.post('/', createPlaylist);
router.put('/:id', updatePlaylist);
router.put('/:id/add', addSongToPlaylist);
router.put('/:id/remove', removeSongFromPlaylist);
router.delete('/:id', deletePlaylist);

module.exports = router;
