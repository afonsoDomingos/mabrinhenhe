const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const Artist = require('../models/Artist');
const Event = require('../models/Event');
const Post = require('../models/Post');
const Contact = require('../models/Contact');
const Gallery = require('../models/Gallery');
const { requireAdmin } = require('../middleware/auth');

// Helper to parse Device from User Agent
function getDeviceType(ua = '') {
  if (!ua) return 'Desktop 💻';
  if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'Telemóvel 📱';
  }
  return 'Desktop 💻';
}

// POST /api/stats/visit — public (records visit)
router.post('/visit', async (req, res) => {
  try {
    const { path } = req.body;
    const userAgent = req.headers['user-agent'] || '';
    const device = getDeviceType(userAgent);
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    const country = req.headers['x-vercel-ip-country'] || 'MZ';
    const city = req.headers['x-vercel-ip-city'] || '';

    const visit = new Visit({
      path: path || '/',
      userAgent,
      device,
      ip: typeof ip === 'string' ? ip.split(',')[0].trim() : '',
      country,
      city,
    });

    await visit.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats — admin only (summary + 50 recent detailed visits)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      artistsCount,
      eventsCount,
      postsCount,
      contactsCount,
      galleryCount,
      visitsCount,
      todayVisitsCount,
      recentVisits,
    ] = await Promise.all([
      Artist.countDocuments(),
      Event.countDocuments(),
      Post.countDocuments(),
      Contact.countDocuments(),
      Gallery.countDocuments(),
      Visit.countDocuments(),
      Visit.countDocuments({ createdAt: { $gte: startOfToday } }),
      Visit.find().sort({ createdAt: -1 }).limit(50),
    ]);

    res.json({
      artists: artistsCount,
      events: eventsCount,
      posts: postsCount,
      contacts: contactsCount,
      gallery: galleryCount,
      visits: visitsCount,
      todayVisits: todayVisitsCount,
      recentVisits,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
