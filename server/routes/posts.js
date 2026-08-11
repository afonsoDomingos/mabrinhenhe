const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar publicações.' });
  }
});

// POST create a public post
router.post('/', async (req, res) => {
  try {
    const { content, user, initials } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'O conteúdo não pode estar vazio.' });
    }
    const post = new Post({
      content: content.trim(),
      user: user || 'Comunidade Mabrinhenhe',
      initials: initials || 'CM',
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT like/unlike a post
router.put('/:id/like', async (req, res) => {
  try {
    const { action } = req.body; // 'like' or 'unlike'
    const increment = action === 'unlike' ? -1 : 1;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: increment } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Publicação não encontrada.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
