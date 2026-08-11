const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema(
  {
    path: { type: String, default: '/' },
    userAgent: { type: String, default: '' },
    device: { type: String, default: 'Desktop' },
    ip: { type: String, default: '' },
    country: { type: String, default: '' },
    city: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visit', VisitSchema);
