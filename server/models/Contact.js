const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['artista', 'patrocinador', 'imprensa', 'outro'],
      default: 'artista',
    },
    genre: { type: String, default: '' },
    message: { type: String, required: true },
    instagram: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pendente', 'lido', 'aprovado', 'rejeitado'],
      default: 'pendente',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', ContactSchema);
