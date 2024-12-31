const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');  
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

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
        
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'User logged in', username, token });
      } else {
        user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered', username, token });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
