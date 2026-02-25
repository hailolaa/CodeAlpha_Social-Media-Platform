const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const path = require('path');



app.use(express.static(path.join(__dirname, '../frontend')));

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));



app.listen(5000, () => {
  console.log('Server running on port 5000');
  console.log('Access the application at http://localhost:5000');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    console.log('Continuing without database... API calls will fail.');
  });
