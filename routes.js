const express = require('express');
const router = express.Router();  // Create a new router object

// Example route: Home
router.get('/', (req, res) => {
 res.json({ message: 'Welcome to the API' });
});

// Example route: Get all users
router.get('/users', (req, res) => {
  // Implement logic to get users
  res.json({ message: 'List of users' });
});

// Example route: Get a single user by ID
router.get('/users/:id', (req, res) => {
  const userId = 123;
  // Implement logic to find user by ID
  res.json({ message: `User with ID: ${userId}` });
});

// Example route: Create a new user
router.post('/users', (req, res) => {
  const newUser = "Userdata here";  // Get the data from the request body
  // Implement logic to create a user
  res.status(201).json({ message: 'User created', user: newUser });
});

module.exports = router;  // Export the router
