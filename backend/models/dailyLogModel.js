const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
    notes: {
        type: String,
        required: true, 
    },
    dailyMood: {
        type: String,
        enum: ['happy', 'sad', 'neutral', 'extra_happy', 'extra_sad'], 
        required: true,
    },
    tags: {
        eat: {
            type: String,
            enum: ['healthy', 'unhealthy', 'moderate'], 
            default: 'moderate',
        },
        walk: {
            type: Boolean,
            default: false, 
        },
        familyTime: {
            type: Boolean,
            default: false, 
        },
        exercise: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low',
        },
        work: {
            type: String,
            enum: ['productive', 'neutral', 'unproductive'], 
            default: 'neutral',
        },
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
});

const Diary = mongoose.model('Diary', diarySchema);

module.exports = Diary;