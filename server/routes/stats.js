const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const Artist = require('../models/Artist');
const Event = require('../models/Event');
const Post = require('../models/Post');
const Contact = require('../models/Contact');
const Gallery = require('../models/Gallery');
const { requireAdmin } = require('../middleware/auth');

// POST /api/stats/visit — public (records visit)
router.post('/visit', async (req, res) => {
  try {
    const { path } = req.body;
    const visit = new Visit({ path: path || '/', userAgent: req.headers['user-agent'] || '' });
    await visit.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats — admin only
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [artistsCount, eventsCount, postsCount, contactsCount, galleryCount, visitsCount] = await Promise.all([
      Artist.countDocuments(),
      Event.countDocuments(),
      Post.countDocuments(),
      Contact.countDocuments(),
      Gallery.countDocuments(),
      Visit.countDocuments(),
    ]);

    const recentVisits = await Visit.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      artists: artistsCount,
      events: eventsCount,
      posts: postsCount,
      contacts: contactsCount,
      gallery: galleryCount,
      visits: visitsCount,
      recentVisits,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
