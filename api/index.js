require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const artistsRouter = require('../server/routes/artists');
const eventsRouter = require('../server/routes/events');
const postsRouter = require('../server/routes/posts');
const uploadRouter = require('../server/routes/upload');
const seedRouter = require('./seed');
const contactRouter = require('../server/routes/contact');
const galleryRouter = require('../server/routes/gallery');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Serverless DB Connection Caching
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI env variable is missing!');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB connected (serverless)');
  } catch (err) {
    console.error('❌ MongoDB error:', err.message);
  }
};

// Attach DB before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed.' });
  }
});

app.use('/api/artists', artistsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/contact', contactRouter);
app.use('/api/gallery', galleryRouter);

app.get('/api/health', (req, res) =>
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env: {
      mongoUri: !!process.env.MONGODB_URI,
      adminPw: !!process.env.ADMIN_PASSWORD,
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
    },
  })
);

// Catch-all JSON error handler — prevents Vercel HTML error pages
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

module.exports = app;
