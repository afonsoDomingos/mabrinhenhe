const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { requireAdmin } = require('../middleware/auth');

// GET /api/gallery — public
router.get('/', async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/gallery — admin only
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, eventDate, imageUrl, category } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Título e imagem são obrigatórios.' });
    }
    const photo = new Gallery({ title, eventDate, imageUrl, category });
    await photo.save();
    res.status(201).json(photo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/gallery/:id — admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
