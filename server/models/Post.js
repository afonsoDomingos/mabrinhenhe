const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    user: { type: String, default: 'Membro Mabrinhenhe' },
    initials: { type: String, default: 'MM' },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
