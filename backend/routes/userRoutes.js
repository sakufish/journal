const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); 

router.post('/register', async (req, res) => {
  const { username } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username });
      await user.save();
    }
    res.status(201).json({ message: 'User logged in', username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
