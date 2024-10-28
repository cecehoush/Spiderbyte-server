import express from 'express';  // Import express
import mongoose from 'mongoose';  // Import mongoose
import dotenv from 'dotenv';  // Import dotenv for environment variables
import userRoutes from './api/routes/user_routes.js';  // Import user routes (note the .js extension)
import submissionRoutes from './api/routes/submission_routes.js';  // Import submission routes
import subjectRoutes from './api/routes/subject_routes.js';  // Import subject routes
import problemRoutes from './api/routes/problem_routes.js';  // Import problem routes
import cors from 'cors';

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();  // Call dotenv to load .env file

// Middleware (if needed)
app.use(express.json());  // To parse JSON requests
app.use(cors()); // To allow the frontend to make requests to the server

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// API Routes
app.use('/api/users', userRoutes);  // Prefix routes with /api/users
app.use('/api/submissions', submissionRoutes);  // Prefix routes with /api/submissions
app.use('/api/subjects', subjectRoutes);  // Prefix routes with /api/subjects
app.use('/api/problems', problemRoutes);  // Prefix routes with /api/problems

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
