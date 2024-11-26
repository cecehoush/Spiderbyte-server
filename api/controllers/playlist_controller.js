const Playlist = require('../models/playlist_model');

// Create a new playlist
exports.createPlaylist = async (req, res) => {
    try {
        const { name, description, created_by } = req.body;
        const newPlaylist = new Playlist({ name, description, created_by });
        await newPlaylist.save();
        res.status(201).json({ message: 'Playlist created successfully', playlist: newPlaylist });
    } catch (error) {
        res.status(500).json({ message: 'Error creating playlist', error });
    }
};

// Add a challenge to the playlist
exports.addChallengeToPlaylist = async (req, res) => {
    try {
        const { playlistId, challengeId } = req.body;
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        playlist.challenges.push(challengeId);
        await playlist.save();
        res.status(200).json({ message: 'Challenge added to playlist successfully', playlist });
    } catch (error) {
        res.status(500).json({ message: 'Error adding challenge to playlist', error });
    }
};

// Delete a playlist
exports.deletePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const playlist = await Playlist.findByIdAndDelete(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting playlist', error });
    }
};
