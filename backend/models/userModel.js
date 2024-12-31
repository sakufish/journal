const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    bcrypt: true 
  },
  diaryEntries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Diary',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(bcrypt);
const User = mongoose.model('User', userSchema);

module.exports = User;
