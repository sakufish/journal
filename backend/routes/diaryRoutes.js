const express = require('express');
const Diary = require('../models/dailyLogModel.js');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { notes, dailyMood, tags } = req.body;

        const diaryEntry = new Diary({
            notes,
            dailyMood,
            tags,
        });

        await diaryEntry.save();
        res.status(201).json({ message: 'Diary entry created', diaryEntry });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const diaryEntries = await Diary.find();
        res.json(diaryEntries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
