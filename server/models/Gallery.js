const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    eventDate: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'Geral' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', GallerySchema);
