import express from 'express';  // Import express
import mongoose from 'mongoose';  // Import mongoose
import dotenv from 'dotenv';  // Import dotenv for environment variables
import userRoutes from './api/routes/user_routes.js';  // Import user routes
import submissionRoutes from './api/routes/submission_routes.js';  // Import submission routes
import subjectRoutes from './api/routes/subject_routes.js';  // Import subject routes
import challengeRoutes from './api/routes/challenge_routes.js';  // Import problem routes
import cors from 'cors';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session'; // Import MongoDB store for sessions
import http from 'http'; // Import the HTTP module
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique IDs
import { credentials } from 'amqplib';

// Initialize express app
const app = express();
const server = http.createServer(app); // Create an HTTP server using the Express app (this is done once at the beginning)
const wss = new WebSocketServer({ server }); // Create the WebSocket server

// Load environment variables
dotenv.config();  // Call dotenv to load .env file

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Create a MongoDB store for sessions
const MongoDBStore = connectMongo(session); // Use the renamed import to create the store

// Configure the session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI, 
  collection: 'sessions', 
});

// Session middleware
app.use(session({
  secret: process.env.SECRET_KEY, 
  resave: false,
  saveUninitialized: true, //This is important because it allows sessions to be created even when not authenticated
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 8, // 1 day expiration -- (1000 ms) * 60 (minutes) * 60 (hour) * 8
    httpOnly: true, // Helps mitigate XSS attacks (GPT suggested this field)
  },
}));

// Middleware
app.use(express.json());  // To parse JSON requests
app.use(cors({
  origin: /^http:\/\/localhost(:[0-9]+)?$/, 
  credentials: true
})); 

// API Routes
app.use('/api/users', userRoutes);  // Prefix routes with /api/users
app.use('/api/submissions', submissionRoutes);  // Prefix routes with /api/submissions
app.use('/api/subjects', subjectRoutes);  // Prefix routes with /api/subjects
app.use('/api/challenges', challengeRoutes);  // Prefix routes with /api/challenges
// New route for testing session


wss.on('connection', (ws, req) => {
  const cookies = req.headers.cookie?.split('; ');
  const sessionCookie = cookies?.find(cookie => cookie.startsWith('connect.sid='));
  const fullSessionId = sessionCookie ? sessionCookie.split('=')[1] : null;

  const decodedSessionId = fullSessionId ? decodeURIComponent(fullSessionId) : null;
  const sessionId = decodedSessionId.substring(2).split('.')[0]; 
  

  console.log("session id", sessionId);
  if (sessionId) { 
    //Retrieve the session using the session ID 
    store.get(sessionId, (err, session) => { 
      if (err || !session) {
        console.log('Session not found:', err);
        ws.close();
        return;
      }

      //Generate a unique client ID for this connection instance
      const clientId = uuidv4();
      
      // Store the WebSocket connection and clientId in the session
      if (!session.clientConnections) {
        session.clientConnections = {}; // Initialize if not already set
      }
      session.clientConnections[clientId] = ws; // Store the WebSocket connection

      // send the client their ID and the session id
      ws.send(JSON.stringify({ clientId, sessionId }));
      console.log("intial socket message:", JSON.stringify({ clientId, sessionId }))

      ws.on('close', () => {
        console.log('Client disconnected');
        delete session.clientConnections[clientId]; // Clean up when the client disconnects
      });
      
      console.log(`Client connected with ID: ${clientId}`);
    });
  } else {
    console.log('No session ID provided, closing connection');
    ws.close();
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { store };
