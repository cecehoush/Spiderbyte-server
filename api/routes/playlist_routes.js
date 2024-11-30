import express from 'express';
import * as playlistController from '../controllers/playlist_controller.js';

const router = express.Router();

// Create a new playlist
router.post('/create', playlistController.createPlaylist);

// Add a challenge to the playlist
router.post('/add-challenge', playlistController.addChallengeToPlaylist);

router.get('/:userId', playlistController.getPlaylistsByUser);

// Get a playlist by name
router.get('/playlist/:name', playlistController.getPlaylistByName);

// Delete a playlist
router.delete('/delete/:playlistId', playlistController.deletePlaylist);

export default router;
