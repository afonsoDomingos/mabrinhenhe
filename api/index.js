require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const artistsRouter = require('../server/routes/artists');
const eventsRouter = require('../server/routes/events');

const app = express();

app.use(cors());
app.use(express.json());

// Serverless DB Connection Caching
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
    }
  } catch (err) {
    console.error('MongoDB connection error in Vercel function:', err.message);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/artists', artistsRouter);
app.use('/api/events', eventsRouter);

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', db: isConnected ? 'connected' : 'disconnected' })
);

module.exports = app;
