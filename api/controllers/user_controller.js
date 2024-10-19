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

// Function to get a single user by firebase ID
export async function getUserByFirebaseId(req, res) {
  try {
    // MongoDB query to find a user by firebase ID
    const user = await User.findOne({ firebase_id: req.params.firebaseId });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500);
  }
}

// Function to update a user by firebase ID
export async function updateUserByFirebaseId(req, res) {
  try {
    // MongoDB query to update a user by firebase ID
    const user = await User.findOne({ firebase_id: req.params.firebaseId });
    if (!user) {
      return res.status(404);
    }
    Object.assign(user, req.body);
    await user.save();
    return res.status(200).json(user);
  }
  catch (err) {
    return res.status(500);
  }
}

// Function to delete a user by firebase ID
export async function deleteUserByFirebaseId(req, res) {
  try {
    // MongoDB query to delete a user by firebase ID
    const user = await User.findOne({ firebase_id: req.params.firebaseId });
    if (!user) {
      return res.status(404);
    }
    await user.remove();
    return res.status(200).json({ message: 'User deleted' });
  }
  catch (err) {
    return res.status(500);
  }
}


