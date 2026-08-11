const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { requireAdmin } = require('../middleware/auth');

// POST /api/contact — public submission
router.post('/', async (req, res) => {
  try {
    const { name, email, type, genre, message, instagram, tiktok } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Nome, email e mensagem são obrigatórios.' });
    }
    const contact = new Contact({ name, email, type, genre, message, instagram, tiktok });
    await contact.save();
    res.status(201).json({ success: true, message: 'Candidatura enviada com sucesso!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/contact — admin only
router.get('/', requireAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/contact/:id — update status (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!contact) return res.status(404).json({ error: 'Candidatura não encontrada.' });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/contact/:id — admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
