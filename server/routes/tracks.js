const express = require('express');
const router = express.Router();
const Track = require('../server/models/Track');
const { requireAdmin } = require('../server/middleware/auth');

// GET /api/tracks — public
router.get('/', async (req, res) => {
  try {
    const tracks = await Track.find().sort({ createdAt: -1 });
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tracks — admin only
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, artistName, audioUrl } = req.body;
    if (!title || !artistName || !audioUrl) {
      return res.status(400).json({ error: 'Título, nome do artista e ficheiro de áudio são obrigatórios.' });
    }
    const track = new Track({ title, artistName, audioUrl });
    await track.save();
    res.status(201).json(track);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/tracks/:id — admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Track.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
