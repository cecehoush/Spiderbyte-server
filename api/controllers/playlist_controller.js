import Playlist from '../models/playlist_model.js';

// Create a new playlist
export async function createPlaylist(req, res) {
    try {
        const { name, description, created_by } = req.body;
        const newPlaylist = new Playlist({ name, description, created_by });
        await newPlaylist.save();
        res.status(201).json({ message: 'Playlist created successfully', playlist: newPlaylist });
    } catch (error) {
        res.status(500).json({ message: 'Error creating playlist', error });
    }
}

// Add one or more challenges to the playlist
export async function addChallengeToPlaylist(req, res) {
    try {
        const { playlistId, challengeIds } = req.body; // Accept an array of challenge IDs
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        playlist.challenges.push(...challengeIds); // Add multiple challenges
        await playlist.save();
        res.status(200).json({ message: 'Challenges added to playlist successfully', playlist });
    } catch (error) {
        res.status(500).json({ message: 'Error adding challenges to playlist', error });
    }
}

// Delete a playlist
export async function deletePlaylist(req, res) {
    try {
        const { playlistId } = req.params;
        const playlist = await findByIdAndDelete(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting playlist', error });
    }
}

// Get all playlists by user
export async function getPlaylistsByUser(req, res) {
    try {
        const { userId } = req.params;
        const playlists = await Playlist.find({ created_by: userId });
        res.status(200).json({ playlists });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving playlists', error });
    }
}

// Get a playlist by name
export async function getPlaylistByName(req, res) {
    try {
        const { name } = req.params;
        const playlist = await Playlist.findOne({ name });
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ playlist });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving playlist', error });
    }
}
