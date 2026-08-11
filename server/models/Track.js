const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artistName: { type: String, required: true, trim: true },
    audioUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Track', TrackSchema);
