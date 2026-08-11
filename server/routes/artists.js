const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const { requireAdmin } = require('../middleware/auth');

// GET all artists
router.get('/', async (req, res) => {
  try {
    const artists = await Artist.find().sort({ featured: -1, createdAt: -1 });
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar artistas.' });
  }
});

// POST create artist (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const artist = new Artist(req.body);
    await artist.save();
    res.status(201).json(artist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update artist (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!artist) return res.status(404).json({ error: 'Artista não encontrado.' });
    res.json(artist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE artist (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artista não encontrado.' });
    res.json({ message: 'Artista apagado com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
