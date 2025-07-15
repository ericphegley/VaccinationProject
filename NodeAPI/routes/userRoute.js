const express = require('express');
const router = express.Router();
const User = require('../models/User');

//register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const newUser = await User.create(req.body);
    return res.status(201).json({ message: 'User registered', user: newUser });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Successful login
    return res.status(200).json({ message: 'Login successful', user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users - List all users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
