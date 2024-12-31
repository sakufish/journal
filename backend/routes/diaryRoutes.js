const express = require('express');
const router = express.Router();
const User = require('../models/userModel');  
const Diary = require('../models/dailyLogModel');
const protectRoute = require('../middleware/protectRoute'); 

router.get('/entries/:username', protectRoute, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user || user.username !== req.user.username) {
            return res.status(403).json({ message: 'Not authorized to view this data' });
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

router.post('/add-entry', protectRoute, async (req, res) => {
    const { username, dailyMood, notes, tags } = req.body;

    try {
        let user = await User.findOne({ username });

        if (!user || user.username !== req.user.username) {
            return res.status(403).json({ message: 'Not authorized to add entries for this user' });
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
