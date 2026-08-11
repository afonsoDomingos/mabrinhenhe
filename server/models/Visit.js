const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema(
  {
    path: { type: String, default: '/' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visit', VisitSchema);
