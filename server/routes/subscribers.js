const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const { requireAdmin } = require('../middleware/auth');

// POST /api/subscribers — public subscribe
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Por favor, introduza um email válido.' });
    }

    let sub = await Subscriber.findOne({ email: email.toLowerCase() });
    if (sub) {
      if (!sub.active) {
        sub.active = true;
        await sub.save();
      }
      return res.json({ success: true, message: 'Já estás inscrito na nossa lista!' });
    }

    sub = new Subscriber({ email });
    await sub.save();
    res.status(201).json({ success: true, message: 'Inscrição realizada com sucesso! Serás notificado dos novos eventos.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/subscribers — admin only
router.get('/', requireAdmin, async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/subscribers/:id — admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
