const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); 

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'enter your username and password' });
    }
  
    try {
      let user = await User.findOne({ username });
  
      if (user) {
        const isValidPassword = await user.verifyPassword(password);
        
        if (!isValidPassword) {
          return res.status(401).json({ message: 'wrong password. this account already exists' });
        }
        
        res.status(200).json({ message: 'User logged in', username });
      } else {
        user = new User({ 
          username,
          password
        });
        await user.save();
        
        res.status(201).json({ message: 'User registered', username });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
