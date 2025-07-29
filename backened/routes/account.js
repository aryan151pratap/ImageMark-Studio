const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
  const { username, email } = req.body;

  console.log(username, email);

  if (!username || !email) {
    return res.status(400).json({ message: 'Username and email are required' });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists', user });
    }

    user = new User({ username, email });
    await user.save();

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/users/signin', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Sign-in successful', user });
  } catch (err) {
    console.error('Error signing in:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
