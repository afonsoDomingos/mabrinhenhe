const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    artists: { type: [String], default: [] },
    status: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
    description: { type: String, required: true },
    ticketUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
