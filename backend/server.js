const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const bodyParser = require('body-parser');

require('dotenv').config();

const PORT = 3000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

connectDB();

app.use('/api/users', userRoutes); 
app.use('/api/diary', diaryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
