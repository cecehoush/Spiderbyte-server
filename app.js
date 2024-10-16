require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');  // Import your routes

const app = express();

// Middleware (if needed)
app.use(express.json());  // To parse JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// API Routes
app.use('/api', routes);  // Prefix routes with /api

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
