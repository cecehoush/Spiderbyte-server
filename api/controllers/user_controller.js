import User from '../models/user_model.js';

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
