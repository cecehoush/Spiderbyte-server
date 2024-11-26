import express from 'express';
import { createPlaylist, addChallengeToPlaylist, deletePlaylist } from '../controllers/playlist_controller';

const router = express.Router();

// Create a new playlist
router.post('/create', createPlaylist);

// Add a challenge to the playlist
router.post('/add-challenge', addChallengeToPlaylist);

// Delete a playlist
router.delete('/delete/:playlistId', deletePlaylist);

export default router;
