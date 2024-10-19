import express from 'express';  // Import express
import mongoose from 'mongoose';  // Import mongoose
import dotenv from 'dotenv';  // Import dotenv for environment variables
import userRoutes from './api/routes/user_routes.js';  // Import user routes (note the .js extension)

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();  // Call dotenv to load .env file

//middle ware that allows us to parse json data from the request body
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// API Routes
// Prefix routes with /api/users
app.use('/api/users', userRoutes);

// Start the server user port 5000, if ENV isnt setup use 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
