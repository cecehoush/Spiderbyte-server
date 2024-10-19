import User from '../models/user_model.js';

// Function to get all users
export async function getUsers(req, res) {
  try {
    // MongoDB query to find all users
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500);
  }
}

// Function to create a new user
export async function createUser(req, res) {
  try {
    // MongoDB query to create a new user from the request body
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500);
  }
}
