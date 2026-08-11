const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { requireAdmin } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dnvnftvky',
  api_key: process.env.CLOUDINARY_API_KEY || '259851568455899',
  api_secret: process.env.CLOUDINARY_API_SECRET || '3hRsXzUVd3pnwn9IKQWN7UAeJLc',
});

// Configure Multer in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// POST /api/upload — Upload image to Cloudinary
router.post('/', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum ficheiro de imagem enviado.' });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'mabrinhenhe' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ error: 'Erro ao fazer upload no Cloudinary: ' + error.message });
      }
      res.json({ url: result.secure_url, public_id: result.public_id });
    }
  );

  stream.end(req.file.buffer);
});

module.exports = router;
