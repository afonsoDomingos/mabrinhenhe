const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { requireAdmin } = require('../middleware/auth');

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar eventos.' });
  }
});

// GET single event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let event = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar evento.' });
  }
});

// POST create event (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update event (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ error: 'Evento não encontrado.' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE event (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Evento não encontrado.' });
    res.json({ message: 'Evento apagado com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
