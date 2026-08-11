const express = require('express');
const router = express.Router();
const Artist = require('../server/models/Artist');
const Event = require('../server/models/Event');
const Post = require('../server/models/Post');

const artists = [
  { name: 'MC Xindza', genre: 'Hip-Hop • Afrobeat', description: 'Voz marcante da Província de Gaza. Referência no hip-hop moçambicano com letras que tocam a realidade da juventude.', featured: true, imageUrl: '' },
  { name: 'Bella Maputo', genre: 'Afropop • R&B', description: 'Uma artista que mistura sons africanos com ritmos modernos de forma única. Conhecida pela sua voz suave e presença de palco.', featured: false, imageUrl: '' },
  { name: 'DJ Nyanga', genre: 'Electronic • House', description: 'Producer e DJ reconhecido por sets energéticos e sons inovadores. Já tocou nos maiores eventos de Gaza.', featured: false, imageUrl: '' },
  { name: 'Grupo Chibuto', genre: 'Marrabenta • Tradicional', description: 'Preservando a riqueza cultural de Gaza através da música tradicional moçambicana. Orgulho da Província.', featured: false, imageUrl: '' },
  { name: 'Simão Flow', genre: 'Rap • Soul', description: 'Letras profundas que refletem a realidade e a esperança da juventude moçambicana. Flow único e inconfundível.', featured: false, imageUrl: '' },
  { name: 'Ana Vilankulos', genre: 'Gospel • World Music', description: 'Voz poderosa que eleva o espírito e une comunidades através da música. Uma das vozes mais respeitadas da região.', featured: false, imageUrl: '' },
];

const events = [
  { title: 'NOITE AFRO — GAZA SOUNDS', date: '28 SET 2026', time: '21:00', location: 'Praça Central de Xai-Xai', artists: ['MC Xindza', 'DJ Nyanga', 'Bella Maputo'], status: 'upcoming', description: 'A grande noite do som africano. Três artistas numa noite histórica para Gaza.', ticketUrl: '', imageUrl: '' },
  { title: 'FESTIVAL MARRABENTA VIVA', date: '15 OUT 2026', time: '18:00', location: 'Estádio Municipal de Gaza', artists: ['Grupo Chibuto', 'Ana Vilankulos'], status: 'upcoming', description: 'Celebração da música tradicional moçambicana com os melhores artistas da região de Gaza.', ticketUrl: '', imageUrl: '' },
  { title: 'UNDERGROUND FLOW', date: '02 NOV 2026', time: '20:00', location: 'Club Flamingo, Xai-Xai', artists: ['Simão Flow', 'MC Xindza'], status: 'upcoming', description: 'Uma noite dedicada ao hip-hop e rap de produção moçambicana.', ticketUrl: '', imageUrl: '' },
  { title: 'MABRINHENHE ANNIVERSARY SHOW', date: '12 AGO 2026', time: '19:00', location: 'Jardim da Cidade, Xai-Xai', artists: ['MC Xindza', 'Bella Maputo', 'DJ Nyanga', 'Grupo Chibuto', 'Simão Flow', 'Ana Vilankulos'], status: 'past', description: 'Aniversário da produtora com uma noite histórica de música ao vivo.', ticketUrl: '', imageUrl: '' },
];

const posts = [
  { user: 'Nomsa G.', initials: 'NG', content: '🔥 O show de ontem com o MC Xindza foi incrível! Que energia! Gaza é cultura!', likes: 34, comments: 8 },
  { user: 'Pedro F.', initials: 'PF', content: 'Alguém sabe quando saem os bilhetes para o Festival Marrabenta Viva? 🎶', likes: 12, comments: 5 },
  { user: 'Lucia V.', initials: 'LV', content: 'A Bella Maputo é uma das melhores vozes de Moçambique! 🌟 #GazaSounds', likes: 57, comments: 14 },
];

// GET /api/seed?key=mabrinhenhe2026
router.get('/', async (req, res) => {
  const key = req.query.key;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mabrinhenhe2026';

  if (key !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Chave inválida. Use ?key=<senha_admin>' });
  }

  try {
    await Artist.deleteMany({});
    await Event.deleteMany({});
    await Post.deleteMany({});

    const insertedArtists = await Artist.insertMany(artists);
    const insertedEvents = await Event.insertMany(events);
    const insertedPosts = await Post.insertMany(posts);

    res.json({
      success: true,
      message: 'Base de dados populada com sucesso!',
      data: {
        artists: insertedArtists.length,
        events: insertedEvents.length,
        posts: insertedPosts.length,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro durante o seed: ' + err.message });
  }
});

module.exports = router;
