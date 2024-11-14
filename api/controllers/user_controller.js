import User from '../models/user_model.js';
import bcrypt from 'bcrypt';

export async function getUsers(req, res) {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

export async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

export async function signup(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashedPassword });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

export async function signin(req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err });
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

export async function updateUserSubjectTags(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.preferences.subject_tags = req.body.subject_tags;
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

export async function removeUserSubjectTags(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.preferences.subject_tags = [];
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

export async function updateUserContentTags(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.preferences.content_tags = req.body.content_tags;
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

export async function removeUserContentTags(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.preferences.content_tags = [];
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

