const express = require('express');
const router = express.Router();
const User = require('../models/userModel');  
const Diary = require('../models/dailyLogModel');

router.get('/entries/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        
        if (!user) {
            const newUser = new User({ username: req.params.username });
            await newUser.save();
            return res.status(200).json([]);
        }

        const entries = await Diary.find({
            _id: { $in: user.diaryEntries }
        }).sort({ createdAt: -1 });

        res.status(200).json(entries);
    } catch (error) {
        console.error('Error fetching entries:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/add-entry', async (req, res) => {
    const { username, dailyMood, notes, tags } = req.body;

    try {
        let user = await User.findOne({ username });

        if (!user) {
            user = new User({ username });
            await user.save();
        }

        const newDiaryEntry = new Diary({
            dailyMood,
            notes,
            tags: tags || {}
        });

        await newDiaryEntry.save();
        user.diaryEntries.push(newDiaryEntry._id);
        await user.save();

        res.status(200).json(newDiaryEntry);
    } catch (error) {
        console.error('Error adding entry:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;