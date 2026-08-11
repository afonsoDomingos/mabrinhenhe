require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const artistsRouter = require('./routes/artists');
const eventsRouter = require('./routes/events');
const postsRouter = require('./routes/posts');
const uploadRouter = require('./routes/upload');
const contactRouter = require('./routes/contact');
const galleryRouter = require('./routes/gallery');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/artists', artistsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/contact', contactRouter);
app.use('/api/gallery', galleryRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado com sucesso!');
  })
  .catch((err) => {
    console.error('⚠️  Aviso MongoDB:', err.message);
    console.error('👉 Acede a https://cloud.mongodb.com → Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)');
    console.log('⚡ Servidor iniciado sem base de dados (modo limitado).');
  });

app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
});
