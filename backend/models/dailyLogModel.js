const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
    notes: {
        type: String,
        required: true, 
    },
    dailyMood: {
        type: String,
        enum: ['happy', 'sad', 'neutral', 'excited', 'anxious'], 
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
            type: Number, 
            default: 0,
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